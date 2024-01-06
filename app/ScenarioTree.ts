import { getActionDefinitionById } from '../database/actionDefinitions';
import {
  getConditionItems,
  getCondtitionHeaderById,
} from '../database/conditions';
import { getEventDefinitionById } from '../database/eventDefinitions';
import {
  createScenarioEntityHistory,
  CreateScenarioEntityHistoryType,
  getScenarioEntityHistoryLatest,
} from '../database/scenarioEntityHistory';
import { getScenarioHeaderById, getScenarioItems } from '../database/scenarios';
import { getUserByOrganization } from '../database/users';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import {
  PreStepcomparativeValue,
  ScenarioItemType,
} from '../migrations/00005-createTableScenarioItems';
import { User } from '../migrations/00007-createTableUsers';
import { ConditionHeaderType } from '../migrations/00008-createTableConditionHeader';
import { ConditionItemType } from '../migrations/00010-createTableConditionItems';
import { ActionDefinitionType } from '../migrations/00012-createTableActionDefinitions';
import { ScenarioEntityType } from '../migrations/00016-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../migrations/00017-createTablescenarioEntityHistory';
import { EventDefinitionType } from '../migrations/00019-createTableEventDefinitions';
import ScenarioNodeAction from './dashboard/[organizationId]/scenarios/ScenarioNodeAction';
import ScenarioNodeCond from './dashboard/[organizationId]/scenarios/ScenarioNodeCond';
import ScenarioNodeEvent from './dashboard/[organizationId]/scenarios/ScenarioNodeEvent';
import ScenarioNodeStart from './dashboard/[organizationId]/scenarios/ScenarioNodeStart';
import ScenarioNodeTer from './dashboard/[organizationId]/scenarios/ScenarioNodeTer';
import { sendEmailAction, sendEmailEvent } from './lib/email';

export type WfNodeType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId: number | null;
  preStepComparativeValue: PreStepcomparativeValue;
  children: WfNode[] | null;
  parent: WfNode | null;
};

type LogEntryParam = {
  preStepComparativeValue?: PreStepcomparativeValue;
  state?: ScenarioEntityHistoryType['state'];
  message?: ScenarioEntityHistoryType['message'];
};

export abstract class WfNode {
  node: WfNodeType;
  scenario: ScenarioHeaderType | undefined;
  users: User[] | undefined;
  protected lastHistory: ScenarioEntityHistoryType | undefined;
  protected scenarioEntity: ScenarioEntityType | undefined;
  abstract process(): Promise<PreStepcomparativeValue>;
  abstract readDb(): Promise<void>;
  abstract getTsx(): React.ReactNode;

  constructor(node: WfNodeType, scenarioEntity?: ScenarioEntityType) {
    this.node = node;
    if (scenarioEntity) {
      this.scenarioEntity = scenarioEntity;
    }
  }

  protected async logHistory({
    preStepComparativeValue = null,
    message = null,
    state = 'DONE',
  }: LogEntryParam = {}) {
    if (this.scenarioEntity) {
      const historyEntry: CreateScenarioEntityHistoryType = {
        scenarioEntityId: this.scenarioEntity.scenarioEntityId,
        scenarioId: this.scenarioEntity.scenarioId,
        stepId: this.node.stepId,
        taskType: this.node.taskType,
        taskId: this.node.taskId,
        preStepComparativeValue: preStepComparativeValue,
        state: state,
        message: message,
      };
      return await createScenarioEntityHistory(historyEntry);
    }
  }

  async getLastHistory() {
    if (this.scenarioEntity) {
      return await getScenarioEntityHistoryLatest(
        this.node.scenarioId,
        this.scenarioEntity.scenarioEntityId,
        this.node.stepId,
      );
    }
  }
}

class WfNodeCond extends WfNode {
  condHeader: ConditionHeaderType | undefined;
  condItems: ConditionItemType[] | undefined;

  async process(): Promise<PreStepcomparativeValue> {
    await this.readDb();

    let resultBoolean: boolean = false;
    let state = 'DONE',
      message = '';

    if (this.scenarioEntity && this.node.taskId) {
      const conditionItems = await getConditionItems(this.node.taskId || 0);

      const contextObj = JSON.parse(this.scenarioEntity.context || '');
      conditionItems.forEach(
        (item) => {
          if (item.contextAttributeName && item.compConstant) {
            try {
              const compVariable = contextObj[item.contextAttributeName];
              if (compVariable) {
                switch (item.comperator) {
                  case '<':
                    resultBoolean = compVariable < item.compConstant;
                    break;
                  case '>':
                    resultBoolean = compVariable > item.compConstant;
                    break;
                  default:
                    throw new Error(
                      `Error: Operator ${item.comperator} not (yet) implemented`,
                    );
                }
              } else {
                throw new Error(
                  `Error: Attr ${item.contextAttributeName} not found in context-data`,
                );
              }
            } catch (err: any) {
              state = 'ERROR';
              message = err.message;
            }
          }
        },
        // TODO: implement, multiple condition steps ()
      );

      if (this.lastHistory?.state !== 'DONE') {
        await this.logHistory({
          state: state,
          message: message,
          preStepComparativeValue: resultBoolean ? 'TRUE' : 'FALSE',
        });
      }

      return resultBoolean ? 'TRUE' : 'FALSE';
    }

    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
    this.scenario = await getScenarioHeaderById(this.node.scenarioId);
    if (this.scenario?.orgId) {
      this.users = await getUserByOrganization(this.scenario.orgId);
    }
    if (this.node.taskId) {
      this.condHeader = await getCondtitionHeaderById(this.node.taskId);
      this.condItems = await getConditionItems(this.node.taskId);
    }
  }
  getTsx() {
    if (this.condHeader && this.condItems) {
      return ScenarioNodeCond({
        node: this.node,
        condHeader: this.condHeader,
        condItems: this.condItems,
        lastHistory: this.lastHistory,
      });
    }
  }
}

class WfNodeAction extends WfNode {
  actionDefinition: ActionDefinitionType | undefined;

  async process(): Promise<PreStepcomparativeValue> {
    await this.readDb();

    if (this.lastHistory?.state === 'CONTINUE') {
      // CONTINUE and actionResult has been set by user-interaction
      // give back actionResult to processing chain
      // no additonal history entry at this stage!
      return await this.lastHistory.preStepComparativeValue;
    } else {
      if (this.scenarioEntity && this.node.taskId) {
        const actionDefinition = await getActionDefinitionById(
          this.node.taskId,
        );

        const pendingHistoryEntry = await this.logHistory({ state: 'PENDING' });

        if (actionDefinition && pendingHistoryEntry) {
          try {
            await sendEmailAction(
              actionDefinition.approver,
              actionDefinition.textTemplate,
              pendingHistoryEntry.historyId,
            );
          } catch (e: any) {
            // TODO: update logHistory w/ state = 'ERROR'; message = e;
          }
        }
      }
    }

    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
    this.scenario = await getScenarioHeaderById(this.node.scenarioId);
    if (this.scenario?.orgId) {
      this.users = await getUserByOrganization(this.scenario.orgId);
    }
    if (this.node.taskId) {
      this.actionDefinition = await getActionDefinitionById(this.node.taskId);
    }
  }
  getTsx() {
    if (this.actionDefinition) {
      return ScenarioNodeAction({
        node: this.node,
        actionDefinition: this.actionDefinition,
        lastHistory: this.lastHistory,
      });
    }
  }
}

class WfNodeEvent extends WfNode {
  eventDefinition: EventDefinitionType | undefined;

  async process() {
    let state = 'DONE',
      message = '';

    await this.readDb();
    if (this.lastHistory?.state === 'DONE') return null;
    this.scenario = await getScenarioHeaderById(this.node.scenarioId);
    if (this.scenario?.orgId) {
      this.users = await getUserByOrganization(this.scenario.orgId);
    }
    if (this.scenarioEntity && this.node.taskId) {
      const eventDefinition = await getEventDefinitionById(this.node.taskId);
      // get the recipient email address from context
      try {
        const contextObj = JSON.parse(this.scenarioEntity.context || '');
        if (contextObj && eventDefinition?.recipient) {
          const mailTo = contextObj[eventDefinition.recipient];
          const status = await sendEmailEvent(
            mailTo,
            eventDefinition.textTemplate,
          );
          message = status.Status;
        }
      } catch (e: any) {
        state = 'ERROR';
        message = e;
      }
      await this.logHistory({ state: state, message: message });
    }

    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
    this.scenario = await getScenarioHeaderById(this.node.scenarioId);
    if (this.scenario?.orgId) {
      this.users = await getUserByOrganization(this.scenario.orgId);
    }
    if (this.node.taskId) {
      this.eventDefinition = await getEventDefinitionById(this.node.taskId);
    }
  }
  getTsx() {
    if (this.eventDefinition) {
      return ScenarioNodeEvent({
        node: this.node,
        eventDefinition: this.eventDefinition,
        lastHistory: this.lastHistory,
      });
    }
  }
}

class WfNodeStart extends WfNode {
  scenarioHeader: ScenarioHeaderType | undefined;

  async process() {
    await this.readDb();
    if (this.lastHistory?.state === 'DONE') return null;
    await this.logHistory();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
    this.scenario = await getScenarioHeaderById(this.node.scenarioId);
    if (this.scenario?.orgId) {
      this.users = await getUserByOrganization(this.scenario?.orgId);
    }
    if (this.node.scenarioId) {
      this.scenarioHeader = await getScenarioHeaderById(this.node.scenarioId);
    }
  }
  getTsx() {
    if (this.scenarioHeader) {
      return ScenarioNodeStart({
        node: this.node,
        scenarioHeader: this.scenarioHeader,
        lastHistory: this.lastHistory,
      });
    }
  }
}
class WfNodeTer extends WfNode {
  async process() {
    await this.readDb();
    if (this.lastHistory?.state === 'DONE') return null;
    await this.logHistory();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
    this.scenario = await getScenarioHeaderById(this.node.scenarioId);
    if (this.scenario?.orgId) {
      this.users = await getUserByOrganization(this.scenario?.orgId);
    }
  }
  getTsx() {
    return ScenarioNodeTer({
      node: this.node,
      lastHistory: this.lastHistory,
    });
  }
}

export function getNodeInstance(
  node: WfNodeType,
  scenarioEntity?: ScenarioEntityType,
): WfNode {
  switch (node.taskType) {
    case 'START':
      return new WfNodeStart(node, scenarioEntity);
    case 'COND':
      return new WfNodeCond(node, scenarioEntity);
    case 'ACTION':
      return new WfNodeAction(node, scenarioEntity);
    case 'EVENT':
      return new WfNodeEvent(node, scenarioEntity);
    case 'TER':
      return new WfNodeTer(node, scenarioEntity);
    default:
      throw new Error(`Unkonw task type: ',${node.taskType}`);
  }
}

export default class ScenarioTree {
  constructor(
    scenarioId: ScenarioHeaderType['scenarioId'],
    scenarioEntity?: ScenarioEntityType,
  ) {
    this.scenarioEntity = scenarioEntity;
    this.scenarioId = scenarioId;
  }
  root: WfNode | undefined;
  nodes: WfNode[] = [];
  scenarioEntity: ScenarioEntityType | undefined;
  scenarioId: ScenarioHeaderType['scenarioId'];

  insertNode(newNode: WfNode) {
    this.nodes = [...this.nodes, newNode];
    if (!this.root) {
      this.root = newNode;
    } else {
      const parentNode = this.nodes.find(
        (node) => node.node.stepId === newNode.node.parentStepId,
      );
      if (parentNode) {
        newNode.node.parent = parentNode;
        // we take up to two children
        if (!parentNode.node.children || parentNode.node.children.length < 2) {
          parentNode.node.children = [
            ...(parentNode.node.children || []),
            newNode,
          ];
        }
      }
    }
  }
  async getNodes() {
    const sceanarioItemsData = await getScenarioItems(this.scenarioId);
    if (sceanarioItemsData) {
      await Promise.all(
        sceanarioItemsData.map(async (item: ScenarioItemType) => {
          const newNode = getNodeInstance(
            { ...item, children: null, parent: null },
            this.scenarioEntity,
          );
          this.insertNode(newNode);
          await newNode.readDb();
        }),
      );
    }

    return this.root;
  }
  async process(nodePrc = this.root) {
    if (this.scenarioEntity && nodePrc) {
      const node = nodePrc.node;
      console.log('start process: ', node.stepId, '/', node.taskType);
      const lastHistory = await nodePrc.getLastHistory();
      // If the current step, is PENDING (E.g. awaiting User Interaction, we must stop the processing here)
      if (lastHistory?.state === 'PENDING') {
        return;
      }

      switch (node.taskType) {
        case 'START':
        case 'EVENT':
        case 'TER':
          await nodePrc.process();
          if (node.children) {
            await Promise.all(
              node.children.map(async (step) => {
                await this.process(step);
              }),
            );
          }

          break;
        case 'COND':
        case 'ACTION':
          const result = await nodePrc.process();
          // option (successor) is one of the (two) children
          const option = node.children?.find(
            (opt) => opt.node.preStepComparativeValue === result,
          );
          if (option) await this.process(option);
          break;
        default:
          break;
      }
    }
  }
}

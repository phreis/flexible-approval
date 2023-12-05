import { getActionDefinitionById } from '../database/actionDefinitions';
import {
  getConditionItems,
  getCondtitionHeaderById,
} from '../database/conditions';
import { getEventDefinitionById } from '../database/eventDefinitions';
import { getScenarioEntityHistoryLatest } from '../database/scenarioEntityHistory';
import { getScenarioHeaderById, getScenarioItems } from '../database/scenarios';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import {
  PreStepcomparativeValue,
  ScenarioItemType,
} from '../migrations/00005-createTableScenarioItems';
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

export type WfNodeType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId: number | null;
  preStepComparativeValue: PreStepcomparativeValue;
  children: WfNode[] | null;
};
export abstract class WfNode {
  node: WfNodeType;
  protected lastHistory: ScenarioEntityHistoryType | undefined;
  protected scenarioEntityId:
    | ScenarioEntityType['scenarioEntityId']
    | undefined;
  abstract process(): Promise<PreStepcomparativeValue>;
  abstract readDb(): Promise<void>;
  abstract getTsx(): React.ReactNode;

  constructor(
    node: WfNodeType,
    scenarioEntityId?: ScenarioEntityType['scenarioEntityId'],
  ) {
    this.node = node;
    if (scenarioEntityId) {
      this.scenarioEntityId = scenarioEntityId;
    }
  }

  async getLastHistory() {
    if (this.scenarioEntityId) {
      return await getScenarioEntityHistoryLatest(
        this.node.scenarioId,
        this.scenarioEntityId,
        this.node.stepId,
      );
    }
  }
}

class WfNodeCond extends WfNode {
  condHeader: ConditionHeaderType | undefined;
  condItems: ConditionItemType[] | undefined;
  async process(): Promise<PreStepcomparativeValue> {
    console.log('WfNodeCond.process()');
    await this.readDb();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
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
    console.log('WfNodeAction.process()');
    await this.readDb();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
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
    console.log('WfNodeEvent.process()');
    await this.readDb();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
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
    console.log('WfNodeStart.process()');
    await this.readDb();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
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
    console.log('WfNodeTer.process()');
    await this.readDb();
    return null;
  }
  async readDb() {
    this.lastHistory = await this.getLastHistory();
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
  scenarioEntityId?: ScenarioEntityType['scenarioEntityId'],
): WfNode {
  switch (node.taskType) {
    case 'START':
      return new WfNodeStart(node, scenarioEntityId);
    case 'COND':
      return new WfNodeCond(node, scenarioEntityId);
    case 'ACTION':
      return new WfNodeAction(node, scenarioEntityId);
    case 'EVENT':
      return new WfNodeEvent(node, scenarioEntityId);
    case 'TER':
      return new WfNodeTer(node, scenarioEntityId);
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
          const newNode = getNodeInstance({ ...item, children: null });
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
          node.children?.forEach((step) => this.process(step));
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

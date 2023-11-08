import { getScenarioEntityHistoryLatest } from '../database/scenarioEntityHistory';
import { ScenarioHeaderType } from '../migrations/00001-createTableScenarioHeader';
import { ScenarioItemType } from '../migrations/00003-createTableScenarioItems';
import { ScenarioEntityType } from '../migrations/00015-createTablescenarioEntities';
import {
  processAction,
  processCondition,
  processEvent,
  processStart,
  processTer,
} from './lib/processor';

export type WfNode = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId: number | null;
  condStepResult: boolean | null;
  actionStepResult: string | null;
  children: WfNode[] | null;
};

export default class ScenarioTree {
  constructor(scenarioEntity: ScenarioEntityType) {
    this.scenarioEntity = scenarioEntity;
  }
  root: WfNode | undefined;
  nodes: WfNode[] = [];
  scenarioEntity: ScenarioEntityType;

  insertNode(newNode: WfNode) {
    this.nodes = [...(this.nodes || []), newNode];
    if (!this.root) {
      this.root = newNode;
    } else {
      const parentNode = this.nodes.find(
        (node) => node.stepId === newNode.parentStepId,
      );
      if (parentNode) {
        parentNode.children = [...(parentNode.children || []), newNode];
      }
    }
  }
  getNodes() {
    return this.root;
  }
  async process(node = this.root) {
    if (node) {
      console.log('process: ', node.stepId, ' ', node.taskType);

      // TODO: check this.scenarioEntity against scenarioEntities, if node has to be processed: scenarioEntities.state = null || ERROR || ACTION_RESPONSE_RECEIVED

      const lastHistory = await getScenarioEntityHistoryLatest(
        node.scenarioId,
        this.scenarioEntity.scenarioEntityId,
        node.stepId,
      );

      // If the current step, is PENDING (E.g. awaiting User Interaction, we must stop the processing here)
      if (lastHistory?.state === 'PENDING') {
        return;
      }

      // If the current step, is already done, proceed with the following steps (children)
      // if (lastHistory?.state !== 'DONE') {
      // console.log('Done:', node.taskType);
      // node?.children?.forEach((step) => this.process(step));

      if (node.taskType === 'EVENT') {
        await processEvent(node, this.scenarioEntity, lastHistory);
      }
      if (node.taskType === 'START') {
        await processStart(node, this.scenarioEntity, lastHistory);
      }
      if (node.taskType === 'TER') {
        await processTer(node, this.scenarioEntity, lastHistory);
      }

      if (node.taskType === 'ACTION') {
        const actionResult = await processAction(
          node,
          this.scenarioEntity,
          lastHistory,
        );

        console.log('after process Action: ', actionResult);

        if (actionResult) {
          // ACTION option (successor) is one of the (two) children
          const actionOption = node.children?.find(
            (actionOpt) => actionOpt.actionStepResult === actionResult,
          );
          if (actionOption) {
            await this.process(actionOption);
          }
          return;
        } else {
          return; // PENDING, Stop here, because we need to await Approvers response
        }
      }

      if (node?.taskType === 'COND') {
        // TODO: evalueate COND
        const condResult = await processCondition(
          node,
          this.scenarioEntity,
          lastHistory,
        );
        // COND option (successor) is one of the (two) children
        const condOption = node.children?.find(
          (condOpt) => condOpt.condStepResult === condResult,
        );
        if (condOption) await this.process(condOption);
      } else {
        node?.children?.forEach((step) => this.process(step));
      }
    }
  }
}

import { EventStateType } from '../migrations/00000-createTableEventStates';
import { ScenarioHeaderType } from '../migrations/00001-createTableScenarioHeader';
import { ScenarioItemType } from '../migrations/00003-createTableScenarioItems';
import { processCondition } from './lib/processor';

export type WfNode = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId: number | null;
  condStepResult: boolean | null;
  children: WfNode[] | null;
};

export default class ScenarioTree {
  constructor(scenarioHeader: ScenarioHeaderType, eventEntry: EventStateType) {
    this.scenarioHeader = scenarioHeader;
    this.eventEntry = eventEntry;
  }
  root: WfNode | undefined;
  nodes: WfNode[] = [];
  scenarioHeader: ScenarioHeaderType;
  eventEntry: EventStateType;

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
    let prevWasCondition;
    console.log('process: ', node?.stepId, ' ', node?.taskType);
    if (node?.taskType === 'COND' && node.taskId) {
      // TODO: evalueate COND
      const condResult = await processCondition(
        node.taskId,
        this.eventEntry.context,
      );
      // COND option (successor) is on of the (two) children
      const condOption = node.children?.find(
        (condOpt) => condOpt.condStepResult === condResult,
      );
      await this.process(condOption);
    } else {
      node?.children?.forEach((step) => this.process(step));
    }
  }
}

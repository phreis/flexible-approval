export type WfNode = {
  scenarioId: string;
  stepId: string;
  parentStepId: string | null;
  task: string;
  condStepResult: boolean | null;
  children: WfNode[] | null;
};

export default class ScenarioTree {
  root: WfNode | undefined;
  nodes: WfNode[] = [];

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
}

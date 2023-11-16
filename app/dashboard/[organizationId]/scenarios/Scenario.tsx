import React from 'react';
import { getScenarioEntityHistoryLatest } from '../../../../database/scenarioEntityHistory';
import { ScenarioEntityType } from '../../../../migrations/00015-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNode } from '../../../ScenarioTree';
import styles from './Scenario.module.scss';
import ScenarioNodeAction from './ScenarioNodeAction';
import ScenarioNodeCond from './ScenarioNodeCond';
import ScenarioNodeEvent from './ScenarioNodeEvent';
import ScenarioNodeStart from './ScenarioNodeStart';
import ScenarioNodeTer from './ScenarioNodeTer';

type Props = {
  node: WfNode;
  scenarioEntityId?: ScenarioEntityType['scenarioEntityId'];
};

//export default async function Scenario({ node }: { node: WfNode }) {
export default async function Scenario({ node, scenarioEntityId }: Props) {
  let lastHistoryForNodeArr: ScenarioEntityHistoryType[] | undefined;
  let lastHistoryForNode: ScenarioEntityHistoryType | undefined;

  if (scenarioEntityId) {
    lastHistoryForNodeArr = await getScenarioEntityHistoryLatest(
      node.scenarioId,
      scenarioEntityId,
      node.stepId,
    );
    if (lastHistoryForNodeArr) {
      lastHistoryForNode = lastHistoryForNodeArr[0];
    }
  }

  function nodeRenderer(nde: WfNode) {
    switch (nde.taskType) {
      case 'START':
        return (
          <ScenarioNodeStart node={nde} lastHistory={lastHistoryForNode} />
        );
      case 'COND':
        return <ScenarioNodeCond node={nde} lastHistory={lastHistoryForNode} />;
      case 'ACTION':
        return (
          <ScenarioNodeAction node={nde} lastHistory={lastHistoryForNode} />
        );
      case 'EVENT':
        return (
          <ScenarioNodeEvent node={nde} lastHistory={lastHistoryForNode} />
        );
      case 'TER':
        return <ScenarioNodeTer node={nde} lastHistory={lastHistoryForNode} />;
      default:
      // return <></>;
    }
  }

  return (
    <li key={`key-${node.stepId}`}>
      <span className={styles.box}>{nodeRenderer(node)}</span>
      <ul>
        {node.children?.map((subNode: WfNode) =>
          Scenario({ node: subNode, scenarioEntityId }),
        )}
      </ul>
    </li>
  );
}

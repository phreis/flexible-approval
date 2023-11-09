import React from 'react';
import { WfNode } from '../../ScenarioTree';
import styles from './Scenario.module.scss';
import ScenarioNodeAction from './ScenarioNodeAction';
import ScenarioNodeCond from './ScenarioNodeCond';
import ScenarioNodeEvent from './ScenarioNodeEvent';
import ScenarioNodeStart from './ScenarioNodeStart';
import ScenarioNodeTer from './ScenarioNodeTer';

export default async function Scenario({ node }: { node: WfNode }) {
  function nodeRenderer(nde: WfNode) {
    switch (nde.taskType) {
      case 'START':
        return <ScenarioNodeStart node={nde} />;
      case 'COND':
        return <ScenarioNodeCond node={nde} />;
      case 'ACTION':
        return <ScenarioNodeAction node={nde} />;
      case 'EVENT':
        return <ScenarioNodeEvent node={nde} />;
      case 'TER':
        return <ScenarioNodeTer node={nde} />;
      default:
      // return <></>;
    }
  }

  return (
    <li key={`key-${node.stepId}`}>
      <span className={styles.box}>{nodeRenderer(node)}</span>
      <ul>
        {node.children?.map((subNode: WfNode) => Scenario({ node: subNode }))}
      </ul>
    </li>
  );
}

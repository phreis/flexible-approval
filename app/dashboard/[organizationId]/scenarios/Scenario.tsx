import React from 'react';
import { WfNode } from '../../../ScenarioTree';
import styles from './Scenario.module.scss';

type Props = {
  node: WfNode;
};

export default function Scenario({ node }: Props) {
  return (
    <li key={`key-${node.node.stepId}`}>
      <span className={styles.box}>{node.getTsx()}</span>
      <ul>
        {node.node.children?.map((subNode: WfNode) =>
          Scenario({ node: subNode }),
        )}
      </ul>
    </li>
  );
}

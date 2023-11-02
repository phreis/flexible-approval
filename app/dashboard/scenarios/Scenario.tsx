'use client';
import React from 'react';
import { WfNode } from '../../ScenarioTree';
import styles from './Scenario.module.scss';

export default function Scenario({ node }: { node: WfNode }) {
  const numberOfDirectChildren = node.children?.length || 0;

  return (
    <li key={`key-${node.stepId}`}>
      <span className={styles.box}>
        {node.stepId}
        {node.task}
        {/*         <button onClick={() => console.log(node.stepId, ' clicked!')}>
          click!
        </button> */}
      </span>
      <ul>
        {node.children?.map((subNode: WfNode) => Scenario({ node: subNode }))}
      </ul>
    </li>
  );
}

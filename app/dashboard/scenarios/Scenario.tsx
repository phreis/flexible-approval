import React from 'react';
import { getCondtitionHeaderById } from '../../../database/conditions';
import { getScenarioItems } from '../../../database/scenarios';
import { WfNode } from '../../ScenarioTree';
import styles from './Scenario.module.scss';

export default async function Scenario({ node }: { node: WfNode }) {
  const numberOfDirectChildren = node.children?.length || 0;
  // test TODO:
  //const test = await getScenarioItems(node.scenarioId);
  //console.log(test);
  return (
    <li key={`key-${node.stepId}`}>
      <span className={styles.box}>
        {node.stepId}
        <br />
        {node.taskType}
        <br />
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

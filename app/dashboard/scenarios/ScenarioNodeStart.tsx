import Image from 'next/image';
import React from 'react';
import { getScenarioHeaderById } from '../../../database/scenarios';
import { ScenarioEntityHistoryType } from '../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNode } from '../../ScenarioTree';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon } from './scenarioNodeUtils';

export default async function ScenarioNodeStart(props: {
  node: WfNode;
  lastHistory?: ScenarioEntityHistoryType;
}) {
  const scenarioHeaderArr = await getScenarioHeaderById(props.node.scenarioId);

  const scenarioHeader = scenarioHeaderArr[0];

  return (
    <div className={styles.nodeContainer}>
      <div className={styles.headLine}>
        <span>#{props.node.stepId}</span>
        <span className={styles.taskNameBox}>{props.node.taskType}</span>
        {props.lastHistory && (
          <span className={getStatusIcon(props.lastHistory.state)} />
        )}
      </div>
      <div className={styles.genericData}>
        <span className={styles.description}>
          {scenarioHeader?.description}
        </span>
        <span> Context data description:</span>
        <code>{scenarioHeader?.contextDataDescription}</code>
      </div>
    </div>
  );
}

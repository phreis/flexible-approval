import React from 'react';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNodeType } from '../../../ScenarioTree';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon } from './scenarioNodeUtils';

export default function ScenarioNodeStart(props: {
  node: WfNodeType;
  scenarioHeader: ScenarioHeaderType;
  lastHistory?: ScenarioEntityHistoryType;
}) {
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
          {props.scenarioHeader.description}
        </span>
        <span> Context data description:</span>
        <code>{props.scenarioHeader.contextDataDescription}</code>
      </div>
    </div>
  );
}

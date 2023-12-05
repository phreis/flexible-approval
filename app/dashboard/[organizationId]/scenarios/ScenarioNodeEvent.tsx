import React from 'react';
import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { EventDefinitionType } from '../../../../migrations/00019-createTableEventDefinitions';
import { WfNodeType } from '../../../ScenarioTree';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon, renderTopBox } from './scenarioNodeUtils';

export default async function ScenarioNodeEvent(props: {
  node: WfNodeType;
  eventDefinition: EventDefinitionType;
  lastHistory?: ScenarioEntityHistoryType;
}) {
  return (
    <div className={styles.nodeContainer}>
      {renderTopBox(props.node)}

      <div className={styles.headLine}>
        <span>#{props.node.stepId}</span>
        <span className={styles.taskNameBox}>{props.node.taskType}</span>
        {props.lastHistory && (
          <span className={getStatusIcon(props.lastHistory.state)} />
        )}
      </div>
      <div className={styles.genericData}>
        <span className={styles.description}>
          {props.eventDefinition.description}
        </span>
        <span>Recipient: {props.eventDefinition.recipient}</span>
      </div>
    </div>
  );
}

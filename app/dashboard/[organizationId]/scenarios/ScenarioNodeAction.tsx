import React from 'react';
import { ActionDefinitionType } from '../../../../migrations/00012-createTableActionDefinitions';
import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNodeType } from '../../../ScenarioTree';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon, renderTopBox } from './scenarioNodeUtils';

export default function ScenarioNodeAction(props: {
  node: WfNodeType;
  actionDefinition: ActionDefinitionType;
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
          {props.actionDefinition.description}
        </span>
        <span>Approver: {props.actionDefinition.approver}</span>
      </div>
    </div>
  );
}

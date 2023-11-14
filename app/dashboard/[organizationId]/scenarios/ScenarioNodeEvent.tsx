import React from 'react';
import { getActionDefinitionById } from '../../../../database/actionDefinitions';
import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNode } from '../../../ScenarioTree';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon, renderTopBox } from './scenarioNodeUtils';

export default async function ScenarioNodeEvent(props: {
  node: WfNode;
  lastHistory?: ScenarioEntityHistoryType;
}) {
  // const eventDefintion = await getEventDefinitionById(props.node.taskId);

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
        <span className={styles.description}>{`<not yet implemented>`}</span>
      </div>
    </div>
  );
}

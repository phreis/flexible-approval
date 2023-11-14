import React from 'react';
import {
  getConditionItems,
  getCondtitionHeaderById,
} from '../../../database/conditions';
import { ScenarioEntityHistoryType } from '../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNode } from '../../ScenarioTree';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon, renderTopBox } from './scenarioNodeUtils';

export default async function ScenarioNodeCond(props: {
  node: WfNode;
  lastHistory?: ScenarioEntityHistoryType;
}) {
  const condHeaderArr = await getCondtitionHeaderById(props.node.taskId);
  const condItemsArr = await getConditionItems(props.node.taskId);

  const condHeader = condHeaderArr[0];
  const condItems = condItemsArr[0];

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
        <span className={styles.description}>{condHeader?.description}</span>
        <span className={styles.conditionExpression}>
          <code>{condItems?.contextAttributeName}</code>
          <code>{condItems?.comperator}</code>
          <code>{condItems?.compConstant}</code>
        </span>
      </div>
    </div>
  );
}

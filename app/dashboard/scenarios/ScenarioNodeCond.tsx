import React from 'react';
import {
  getConditionItems,
  getCondtitionHeaderById,
} from '../../../database/conditions';
import { WfNode } from '../../ScenarioTree';
import styles from './ScenarioNode.module.scss';

export default async function ScenarioNodeCond(props: { node: WfNode }) {
  const condHeaderArr = await getCondtitionHeaderById(props.node.taskId);
  const condItemsArr = await getConditionItems(props.node.taskId);

  const condHeader = condHeaderArr[0];
  const condItems = condItemsArr[0];

  function renderTopBox() {
    const constStepResult =
      props.node.condStepResult !== null &&
      (props.node.condStepResult === true ? 'TRUE' : 'FALSE');

    const actionStepResult =
      props.node.actionStepResult !== null && props.node.actionStepResult;

    if (constStepResult || actionStepResult) {
      return (
        <div className={styles.topBox}>
          <span>{constStepResult}</span>
          <span>{actionStepResult}</span>
        </div>
      );
    }
  }

  return (
    <div className={styles.nodeContainer}>
      {renderTopBox()}

      <div className={styles.headLine}>
        <span>#{props.node.stepId}</span>
        <span className={styles.taskNameBox}>{props.node.taskType}</span>
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

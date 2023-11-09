import React from 'react';
import { getActionDefinitionById } from '../../../database/actionDefinitions';
import { WfNode } from '../../ScenarioTree';
import styles from './ScenarioNode.module.scss';

export default async function ScenarioNodeEvent(props: { node: WfNode }) {
  // const eventDefintion = await getEventDefinitionById(props.node.taskId);

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
        <span className={styles.description}>{`<not yet implemented>`}</span>
      </div>
    </div>
  );
}

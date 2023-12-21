import React from 'react';
import { ConditionHeaderType } from '../../../../migrations/00008-createTableConditionHeader';
import { ConditionItemType } from '../../../../migrations/00010-createTableConditionItems';
import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNodeType } from '../../../ScenarioTree';
import NodeAdder from './add/[scenarioId]/NodeAdder';
import styles from './ScenarioNode.module.scss';
import { getStatusIcon, renderTopBox } from './scenarioNodeUtils';

export default function ScenarioNodeCond(props: {
  node: WfNodeType;
  condHeader: ConditionHeaderType;
  condItems: ConditionItemType[];
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
          {props.condHeader.description}
        </span>
        <span className={styles.conditionExpression}>
          <code>{props.condItems[0]?.contextAttributeName}</code>
          <code>{props.condItems[0]?.comperator}</code>
          <code>{props.condItems[0]?.compConstant}</code>
        </span>
      </div>
    </div>
  );
}

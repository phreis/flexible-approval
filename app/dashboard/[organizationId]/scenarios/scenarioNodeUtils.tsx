import { ScenarioEntityHistoryType } from '../../../../migrations/00017-createTablescenarioEntityHistory';
import { WfNode, WfNodeType } from '../../../ScenarioTree';
import styles from './ScenarioNode.module.scss';

export function getStatusIcon(state: ScenarioEntityHistoryType['state']) {
  switch (state) {
    case 'DONE':
    case 'CONTINUE':
      return styles.iconDone;
    case 'ERROR':
      return styles.iconError;
    case 'PENDING':
      return styles.iconPending;
    default:
    // return <></>;
  }
}
export function renderTopBox(node: WfNodeType) {
  /*   const constStepResult =
    node.condStepResult !== null &&
    (node.condStepResult === true ? 'TRUE' : 'FALSE');

  const actionStepResult =
    node.actionStepResult !== null && node.actionStepResult; */

  if (node.preStepComparativeValue) {
    return (
      <div className={styles.topBox}>
        <span>{node.preStepComparativeValue}</span>
        {/*         <span>{actionStepResult}</span> */}
      </div>
    );
  }
}

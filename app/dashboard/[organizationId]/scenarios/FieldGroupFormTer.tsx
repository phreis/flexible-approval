import React from 'react';
import { WfNodeType } from '../../../ScenarioTree';
import FieldGroupFormPreStepResult from './FieldGroupFormPreStepResult';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};

export default function FieldGroupFormTerminate(props: Props) {
  return (
    <div className={styles.fieldGroupContainer}>
      <FieldGroupFormPreStepResult
        actual={props.actual}
        directChildNodes={props.directChildNodes}
      />
    </div>
  );
}

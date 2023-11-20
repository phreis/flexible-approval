import React from 'react';
import { ConditionHeaderType } from '../../../../migrations/00008-createTableConditionHeader';
import { ConditionItemType } from '../../../../migrations/00010-createTableConditionItems';
import { WfNode } from '../../../ScenarioTree';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  node?: WfNode;
  condHeader?: ConditionHeaderType;
  condItem?: ConditionItemType;
  contextAttributeNames: string[];
};

export default function FieldGroupFormCondition(props: Props) {
  return (
    <div className={styles.fieldGroupContainer}>
      <span>
        <label htmlFor="description">Description</label>
        <input id="description" name="description" required={true} />
      </span>
      <span>
        <label htmlFor="contextAttributeName">Context Attribute</label>
        <select
          id="contextAttributeName"
          name="contextAttributeName"
          required={true}
        >
          {props.contextAttributeNames.map((name) => {
            return <option value={name}>{name}</option>;
          })}
        </select>
      </span>
      <span>
        <label htmlFor="operator">Operator</label>

        <select
          id="operator"
          name="operator"
          defaultValue={props.condItem?.comperator}
          required={true}
        >
          <option value="<">Less than</option>
          <option value=">">Greater than</option>
          <option value="=">Equals to</option>
        </select>
      </span>
      <span>
        <label htmlFor="compConstant">Value to compare with</label>
        <input
          id="compConstant"
          name="compConstant"
          type="number"
          defaultValue={props.condItem?.compConstant}
          required={true}
        />
      </span>
      <span>
        <label htmlFor="condStepResult">on conditional Result</label>
        <select id="condStepResult" name="condStepResult" defaultValue={'NULL'}>
          <option value="TRUE">true</option>
          <option value="FALSE">false</option>
          <option value="NULL">not used</option>
        </select>
      </span>
      <span>
        <label htmlFor="actionStepResult">on action Result</label>
        <select id="actionStepResult" name="actionStepResult" defaultValue={''}>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="">not used</option>
        </select>
      </span>
    </div>
  );
}

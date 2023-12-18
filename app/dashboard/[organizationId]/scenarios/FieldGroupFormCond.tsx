import React from 'react';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { ConditionItemType } from '../../../../migrations/00010-createTableConditionItems';
import { getContextAttributeNames } from '../../../lib/utilsClient';
import { WfNodeType } from '../../../ScenarioTree';
import FieldGroupFormPreStepResult from './FieldGroupFormPreStepResult';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  condItem?: ConditionItemType;
  scenario: ScenarioHeaderType;
  parent: WfNodeType;
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};

export default function FieldGroupFormCondition(props: Props) {
  let contextAttributeNames: string[] = [];
  try {
    contextAttributeNames = getContextAttributeNames(
      props.scenario.contextDataDescription,
    );
  } catch (e) {}

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
          {contextAttributeNames.map((name) => {
            return (
              <option key={`key-${name}`} value={name}>
                {name}
              </option>
            );
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
      <FieldGroupFormPreStepResult
        actual={props.actual}
        directChildNodes={props.directChildNodes}
      />
    </div>
  );
}

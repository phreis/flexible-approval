import React from 'react';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { getContextAttributeNames } from '../../../lib/utilsClient';
import { WfNodeType } from '../../../ScenarioTree';
import FieldGroupFormPreStepResult from './FieldGroupFormPreStepResult';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  description?: string;
  textTemplate?: string;
  scenario: ScenarioHeaderType;
  parent: WfNodeType;
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};

export default function FieldGroupFormEvent(props: Props) {
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
        <input
          id="description"
          name="description"
          defaultValue={props.description}
          required={true}
        />
      </span>

      <span>
        <label htmlFor="recipient">Recipient</label>
        <select id="recipient" name="recipient">
          {contextAttributeNames.map((attrName) => {
            return (
              <option key={`key-${attrName}`} value={attrName}>
                {attrName}
              </option>
            );
          })}
        </select>
      </span>

      <span>
        <label htmlFor="textTemplate">Text Template</label>
        <input
          id="textTemplate"
          name="textTemplate"
          defaultValue={props.textTemplate}
        />
      </span>
      <FieldGroupFormPreStepResult
        actual={props.actual}
        directChildNodes={props.directChildNodes}
      />
    </div>
  );
}

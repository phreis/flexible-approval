import React from 'react';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { User } from '../../../../migrations/00007-createTableUsers';
import { getContextAttributeNames } from '../../../lib/utilsClient';
import { WfNode } from '../../../ScenarioTree';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  node?: WfNode;
  description?: string;
  textTemplate?: string;
  recipient?: string;
  scenario: ScenarioHeaderType;
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
        />
      </span>

      <span>
        <label htmlFor="recipient">Recipient</label>
        <select id="recipient" name="recipient">
          {contextAttributeNames.map((attrName) => {
            return <option value={attrName}>{attrName}</option>;
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

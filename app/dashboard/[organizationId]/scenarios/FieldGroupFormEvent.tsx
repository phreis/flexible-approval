import React from 'react';
import { User } from '../../../../migrations/00007-createTableUsers';
import { WfNode } from '../../../ScenarioTree';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  node?: WfNode;
  description?: string;
  textTemplate?: string;
  recipient?: User['username'];
  users: User[];
};

export default function FieldGroupFormEvent(props: Props) {
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
          {props.users.map((user) => {
            return <option value={user.username}>{user.username}</option>;
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

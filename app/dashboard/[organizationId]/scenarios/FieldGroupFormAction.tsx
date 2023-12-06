import React from 'react';
import { User } from '../../../../migrations/00007-createTableUsers';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  description?: string;
  textTemplate?: string;
  users: User[];
};

export default function FieldGroupFormAction(props: Props) {
  console.log('FieldGroupFormAction');
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
        <label htmlFor="approver">Approver</label>
        <select id="approver" name="approver">
          {props.users.map((user) => {
            return (
              <option key={`key-${user.id}`} value={user.username}>
                {user.username}
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
      <span>
        <label htmlFor="onResult">on Result</label>
        <select id="onResult" name="onResult" defaultValue="">
          <option value="TRUE">true</option>
          <option value="FALSE">false</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="">not used</option>
        </select>
      </span>
    </div>
  );
}

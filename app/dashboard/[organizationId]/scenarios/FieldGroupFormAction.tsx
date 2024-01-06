import React from 'react';
import { User } from '../../../../migrations/00007-createTableUsers';
import { WfNodeType } from '../../../ScenarioTree';
import FieldGroupFormPreStepResult from './FieldGroupFormPreStepResult';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  description?: string;
  textTemplate?: string;
  users: User[];
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};

export default function FieldGroupFormAction(props: Props) {
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
      <FieldGroupFormPreStepResult
        actual={props.actual}
        directChildNodes={props.directChildNodes}
      />
    </div>
  );
}

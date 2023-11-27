import React from 'react';
import styles from './FieldGroupsForm.module.scss';

export default function FieldGroupFormTerminate() {
  return (
    <div className={styles.fieldGroupContainer}>
      <span>
        <label htmlFor="condStepResult">on conditional Result</label>
        <select id="condStepResult" name="condStepResult" defaultValue="NULL">
          <option value="TRUE">true</option>
          <option value="FALSE">false</option>
          <option value="NULL">not used</option>
        </select>
      </span>
      <span>
        <label htmlFor="actionStepResult">on action Result</label>
        <select id="actionStepResult" name="actionStepResult" defaultValue="">
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="NULL">not used</option>
        </select>
      </span>
    </div>
  );
}

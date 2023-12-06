import React from 'react';
import styles from './FieldGroupsForm.module.scss';

export default function FieldGroupFormTerminate() {
  return (
    <div className={styles.fieldGroupContainer}>
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

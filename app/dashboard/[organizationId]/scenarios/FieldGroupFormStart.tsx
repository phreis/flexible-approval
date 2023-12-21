import React from 'react';
import styles from './FieldGroupsForm.module.scss';

export default function FieldGroupFormStart() {
  return (
    <div className={styles.fieldGroupContainer}>
      <span>
        <label htmlFor="description">Scenario Description</label>
        <input id="description" name="description" required={true} />
      </span>
      <span>
        <label htmlFor="contextDataDescription">Input Data Description</label>
        <textarea
          id="contextDataDescription"
          name="contextDataDescription"
          rows={7}
          cols={40}
        />
      </span>
    </div>
  );
}

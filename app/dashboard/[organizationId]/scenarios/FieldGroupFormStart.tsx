import React from 'react';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import styles from './FieldGroupsForm.module.scss';

type Props = {
  scenarioHeader?: ScenarioHeaderType;
};

export default function FieldGroupFormStart(props: Props) {
  return (
    <div className={styles.fieldGroupContainer}>
      <span>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          defaultValue={props.scenarioHeader?.description}
        />
      </span>
      <span>
        <label htmlFor="contextDataDescription">Context Data Description</label>
        <input
          id="contextDataDescription"
          name="contextDataDescription"
          defaultValue={props.scenarioHeader?.contextDataDescription}
        />
      </span>
    </div>
  );
}

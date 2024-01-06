'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { scenarioBuilderAction } from '../../../../../lib/nodeActions';
import FieldGroupFormStart from '../../FieldGroupFormStart';
import styles from './ScenarioBuilder.module.scss';

type Props = {
  scenario: ScenarioHeaderType;
};

export default function ScenarioBuilderStart(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(scenarioBuilderAction, initialState);

  return (
    <div className={styles.builderContainer}>
      <form action={dispatch} className={styles.builderFormContainer}>
        <input name="taskType" value="START" hidden={true} readOnly={true} />
        <input
          name="scenarioId"
          value={props.scenario.scenarioId}
          hidden={true}
          readOnly={true}
        />
        <FieldGroupFormStart />
        <button>Create the Start Node</button>
      </form>

      <p>{state?.message}</p>
    </div>
  );
}

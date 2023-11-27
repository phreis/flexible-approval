'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { processScenarioNewAction } from '../../../lib/actions';
import styles from './ScenarioStarter.module.scss';

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
};

export default function ScenarioStarter(props: Props) {
  const initialState = { scenarioEntityId: null, message: null, errors: null };
  const [state, dispatch] = useFormState(
    processScenarioNewAction,
    initialState,
  );
  return (
    <div className={styles.starterContainer}>
      <form
        id="scenarioStarter"
        className={styles.starterFormContainer}
        action={dispatch}
      >
        <input
          name="scenarioId"
          value={props.scenarioId || ''}
          hidden={true}
          readOnly={true}
        />
        <label htmlFor="context">Context</label>

        <textarea
          id="scenarioStarter"
          name="context"
          rows={7}
          cols={40}
          defaultValue=""
        />

        <button>Run once</button>
      </form>
      <p>{state?.message}</p>
    </div>
  );
}

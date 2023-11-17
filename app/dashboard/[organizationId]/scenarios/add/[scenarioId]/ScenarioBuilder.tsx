'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { scenarioBuilderAction } from '../../../../../lib/nodeActions';
import styles from './NewScenario.module.scss';

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
};

export default function ScenarioBuilder(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(scenarioBuilderAction, initialState);

  return (
    <>
      <form action={dispatch}>
        <button>create</button>
        <input
          name="scenarioId"
          value={props.scenarioId}
          hidden={true}
          readOnly={true}
        />
      </form>

      <p>{state?.message}</p>
    </>
  );
}

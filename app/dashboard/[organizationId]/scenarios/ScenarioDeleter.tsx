'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { deleteScenarioAction } from '../../../lib/actions';

export default function ScenarioDeleter(props: {
  scenarioId: ScenarioHeaderType['scenarioId'];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(deleteScenarioAction, initialState);

  return (
    <>
      <form action={dispatch}>
        <button>Delete</button>
        <input
          name="scenarioId"
          value={props.scenarioId || ''}
          hidden={true}
          readOnly={true}
        />
      </form>
      <p>{state.message}</p>
    </>
  );
}

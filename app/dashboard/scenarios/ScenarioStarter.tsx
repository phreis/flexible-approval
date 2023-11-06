'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { EventStateTypes } from '../../../migrations/00000-createTableEventStates';
import { ScenarioHeaderType } from '../../../migrations/00001-createTableScenarioHeader';
import { processScenarioNewAction } from '../../lib/actions';

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  context: EventStateTypes['context'];
};

export default function ScenarioStarter(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(
    processScenarioNewAction,
    initialState,
  );
  return (
    <form action={dispatch}>
      <input
        name="scenarioId"
        value={props.scenarioId || ''}
        hidden={true}
        readOnly={true}
      />
      <label htmlFor="context">Context:</label>
      <input id="context" name="context" defaultValue={props.context || ''} />
      <button>Process...</button>
    </form>
  );
}

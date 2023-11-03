'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { EventStateType } from '../../../migrations/00000-createTableEventStates';
import { ScenarioHeaderType } from '../../../migrations/00001-createTableScenarioHeader';
import { processScenarioAction } from '../../lib/actions';
import { processScenario } from '../../lib/processor';

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  context: EventStateType['context'];
};

export default function ScenarioStarter(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(processScenarioAction, initialState);
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

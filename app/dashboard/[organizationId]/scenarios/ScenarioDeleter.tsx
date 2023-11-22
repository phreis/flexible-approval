'use client';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { useFormState } from 'react-dom';
import { getScenarioHeaders } from '../../../../database/scenarios';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { deleteScenarioAction } from '../../../lib/actions';
import styles from './ScenariosHeader.module.scss';

export default async function ScenarioDeleter(props: {
  scenarioId: ScenarioHeaderType['scenarioId'];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(deleteScenarioAction, initialState);

  return (
    <form action={dispatch}>
      <button>Delete</button>
      <input
        name="scenarioId"
        value={props.scenarioId || ''}
        hidden={true}
        readOnly={true}
      />
    </form>
  );
}

'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { deleteScenarioAction } from '../../../lib/actions';
import styles from './ScenariosHeader.module.scss';

export default function ScenarioDeleter(props: {
  scenarioId: ScenarioHeaderType['scenarioId'];
}) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(deleteScenarioAction, initialState);

  return (
    <form action={dispatch}>
      <button className={styles.iconDelete} title="delete scenario" />
      <input
        name="scenarioId"
        value={props.scenarioId || ''}
        hidden={true}
        readOnly={true}
      />
    </form>
  );
}

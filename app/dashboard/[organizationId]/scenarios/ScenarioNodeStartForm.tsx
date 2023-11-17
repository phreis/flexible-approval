'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { startNodeFormAction } from '../../../lib/nodeActions';
import { WfNode } from '../../../ScenarioTree';
import styles from './Scenario.module.scss';

type Props = {
  node: WfNode;
  scenarioHeader: ScenarioHeaderType;
};
export default async function ScenarioNodeStartForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(startNodeFormAction, initialState);
  return (
    <>
      <form action={dispatch}>
        <span className={styles.description}>
          <input
            name="description"
            defaultValue={props.scenarioHeader?.description}
          />
        </span>
        <span> Context data description:</span>
        <input
          name="contextDataDescription"
          defaultValue={props.scenarioHeader?.contextDataDescription || ''}
        />
        <button>Save</button>
        <p>{state?.message}</p>
      </form>
    </>
  );
}

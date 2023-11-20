'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { startNodeFormAction } from '../../../lib/nodeActions';
import { WfNode } from '../../../ScenarioTree';
import StartFormFieldGroup from './FieldGroupFormStart';
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
        <StartFormFieldGroup scenarioHeader={props.scenarioHeader} />
        <button>Save</button>
        <p>{state?.message}</p>
      </form>
    </>
  );
}

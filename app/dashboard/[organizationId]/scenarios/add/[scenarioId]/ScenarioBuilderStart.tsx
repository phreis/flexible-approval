'use client';
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { User } from '../../../../../../migrations/00007-createTableUsers';
import { scenarioBuilderAction } from '../../../../../lib/nodeActions';
import { WfNode, WfNodeType } from '../../../../../ScenarioTree';
import FieldGroupFormAction from '../../FieldGroupFormAction';
import FieldGroupFormCond from '../../FieldGroupFormCond';
import FieldGroupFormEvent from '../../FieldGroupFormEvent';
import FieldGroupFormStart from '../../FieldGroupFormStart';
import FieldGroupFormTerminate from '../../FieldGroupFormTer';
import styles from './ScenarioBuilder.module.scss';

type Props = {
  scenario: ScenarioHeaderType;
  users: User[];
};

export default function ScenarioBuilderStart(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(scenarioBuilderAction, initialState);

  return (
    <div className={styles.builderContainer}>
      <form action={dispatch} className={styles.builderFormContainer}>
        <input name="taskType" value={'START'} hidden={true} readOnly={true} />
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

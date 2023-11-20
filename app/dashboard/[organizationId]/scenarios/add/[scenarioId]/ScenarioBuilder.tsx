'use client';
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { User } from '../../../../../../migrations/00007-createTableUsers';
import { scenarioBuilderAction } from '../../../../../lib/nodeActions';
import { WfNode } from '../../../../../ScenarioTree';
import FieldGroupFormAction from '../../FieldGroupFormAction';
import FieldGroupFormCond from '../../FieldGroupFormCond';
import FieldGroupFormEvent from '../../FieldGroupFormEvent';
import FieldGroupFormStart from '../../FieldGroupFormStart';
import FieldGroupFormTerminate from '../../FieldGroupFormTer';
import styles from './ScenarioBuilder.module.scss';

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  users: User[];
};

export default function ScenarioBuilder(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(scenarioBuilderAction, initialState);
  const [taskType, setTaskType] = useState('START');

  function subFormRenderer(taskType: WfNode['taskType']) {
    console.log(taskType);
    switch (taskType) {
      case 'START':
        return <FieldGroupFormStart />;
      case 'COND':
        return (
          <FieldGroupFormCond
            contextAttributeNames={['attribute1', 'attribute2']}
          />
        );
      case 'ACTION':
        return <FieldGroupFormAction users={props.users} />;
      case 'EVENT':
        return <FieldGroupFormEvent users={props.users} />;
      case 'TER':
        return <FieldGroupFormTerminate />;
      default:
      // return <></>;
    }
  }
  return (
    <div className={styles.builderContainer}>
      <label htmlFor="taskType">Node Type</label>
      <select
        onChange={(e) => setTaskType(e.target.value)}
        id="taskType"
        name="taskType"
      >
        <option value="START">START</option>
        <option value="COND">COND</option>
        <option value="ACTION">ACTION</option>
        <option value="EVENT">EVENT</option>
        <option value="TER">TER</option>
      </select>
      <form action={dispatch} className={styles.builderFormContainer}>
        {taskType !== 'START' && (
          <>
            <label htmlFor="parentStepId">Parent #</label>
            <input
              type="number"
              name="parentStepId"
              id="parentStepId"
              min={1}
              required={true}
            />
          </>
        )}

        <input name="taskType" value={taskType} hidden={true} readOnly={true} />
        <input
          name="scenarioId"
          value={props.scenarioId}
          hidden={true}
          readOnly={true}
        />
        {subFormRenderer(taskType)}
        <button>Create Node</button>
      </form>

      <p>{state?.message}</p>
    </div>
  );
}

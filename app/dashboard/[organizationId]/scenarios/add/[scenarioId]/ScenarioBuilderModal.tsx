import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { User } from '../../../../../../migrations/00007-createTableUsers';
import { scenarioBuilderAction } from '../../../../../lib/nodeActions';
import { WfNodeType } from '../../../../../ScenarioTree';
import FieldGroupFormAction from '../../FieldGroupFormAction';
import FieldGroupFormCond from '../../FieldGroupFormCond';
import FieldGroupFormEvent from '../../FieldGroupFormEvent';
import FieldGroupFormTerminate from '../../FieldGroupFormTer';
import styles from './ScenarioBuilderModal.module.scss';

type Props = {
  scenario: ScenarioHeaderType;
  users: User[];
  parent: WfNodeType;
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};

export default function ScenarioBuilderModal(props: Props) {
  const initialState = { message: null, errors: {}, actionProcessed: false };
  const [state, dispatch] = useFormState(scenarioBuilderAction, initialState);
  const [taskType, setTaskType] = useState('COND');

  function subFormRenderer(tskType: WfNodeType['taskType']) {
    switch (tskType) {
      case 'COND':
        return (
          <FieldGroupFormCond
            directChildNodes={props.directChildNodes}
            actual={props.actual}
            parent={props.parent}
            scenario={props.scenario}
          />
        );
      case 'ACTION':
        return (
          <FieldGroupFormAction
            directChildNodes={props.directChildNodes}
            actual={props.actual}
            parent={props.parent}
            users={props.users}
          />
        );
      case 'EVENT':
        return (
          <FieldGroupFormEvent
            parent={props.parent}
            scenario={props.scenario}
            directChildNodes={props.directChildNodes}
            actual={props.actual}
          />
        );
      case 'TER':
        return (
          <FieldGroupFormTerminate
            directChildNodes={props.directChildNodes}
            actual={props.actual}
          />
        );
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
        <option value="COND">COND</option>
        <option value="ACTION">ACTION</option>
        <option value="EVENT">EVENT</option>
        <option value="TER">TER</option>
      </select>
      <form action={dispatch} className={styles.builderFormContainer}>
        <input
          type="number"
          name="parentStepId"
          id="parentStepId"
          value={props.actual.stepId}
          hidden={true}
          readOnly={true}
          required={true}
        />
        <input name="taskType" value={taskType} hidden={true} readOnly={true} />
        <input
          name="scenarioId"
          value={props.scenario.scenarioId}
          hidden={true}
          readOnly={true}
        />
        {subFormRenderer(taskType)}
        <button>Create Node</button>
      </form>
      <p>{state.message}</p>
    </div>
  );
}

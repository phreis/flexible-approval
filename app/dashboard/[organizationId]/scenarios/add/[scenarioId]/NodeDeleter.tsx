'use client';
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { ScenarioItemType } from '../../../../../../migrations/00005-createTableScenarioItems';
import { User } from '../../../../../../migrations/00007-createTableUsers';
import { scenarioItemDeleteAction } from '../../../../../lib/nodeActions';
import { WfNodeType } from '../../../../../ScenarioTree';
import Modal from '../../Modal';
import ScenarioBuilderModal from './ScenarioBuilderModal';

type Props = {
  scenarioId: ScenarioItemType['scenarioId'];
  stepId: ScenarioItemType['stepId'];
  directChildNodes: WfNodeType[] | null;
};
export default function NodeDeleter(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(
    scenarioItemDeleteAction,
    initialState,
  );
  if (!props.directChildNodes) {
    return (
      <form action={dispatch}>
        <input
          type="number"
          name="scenarioId"
          value={props.scenarioId}
          hidden={true}
          readOnly={true}
        />
        <input
          type="number"
          name="stepId"
          value={props.stepId}
          hidden={true}
          readOnly={true}
        />
        <button>-</button>
        {state?.message && <p>{state?.message}</p>}
      </form>
    );
  }
}

'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioItemType } from '../../../../../../migrations/00005-createTableScenarioItems';
import { scenarioItemDeleteAction } from '../../../../../lib/nodeActions';
import { WfNodeType } from '../../../../../ScenarioTree';
import styles from '../../ScenarioNode.module.scss';

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
        <button className={styles.iconDelete} title="delete node" />
        {state?.message && <p>{state?.message}</p>}
      </form>
    );
  }
}

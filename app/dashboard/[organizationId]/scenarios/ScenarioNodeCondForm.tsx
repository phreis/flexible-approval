'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { ConditionHeaderType } from '../../../../migrations/00008-createTableConditionHeader';
import {
  condNodeFormAction,
  startNodeFormAction,
} from '../../../lib/nodeActions';
import { WfNode } from '../../../ScenarioTree';
import ConditionFormFieldGroup from './FieldGroupFormCond';
import styles from './Scenario.module.scss';

type Props = {
  node: WfNode;
  condHeader: ConditionHeaderType;
};
export default async function ScenarioNodeCondForm(props: Props) {
  const initialState = { message: null, errors: {} };

  return (
    <>
      <form action={condNodeFormAction}>
        <ConditionFormFieldGroup
          condHeader={props.condHeader}
          contextAttributeNames={['attribute1', 'attribute2']}
        />
        <input
          name="node"
          value={JSON.stringify(props.node)}
          hidden={true}
          readOnly={true}
        />

        <button>Save</button>
      </form>
    </>
  );
}

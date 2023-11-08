'use client';

import { useFormState } from 'react-dom';
import { ActionDefinitionType } from '../../../migrations/00011-createTableActionDefinitions';
import { ScenarioEntityType } from '../../../migrations/00015-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../../../migrations/00017-createTablescenarioEntityHistory';
import { processActionResultAction } from '../../lib/actions';
import styles from './ActionForm.module.scss';

type Props = {
  scenarioEntityHistory: ScenarioEntityHistoryType;
  actionDefinition: ActionDefinitionType;
  scenarioEntity: ScenarioEntityType;
};

export default function ActionForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(
    processActionResultAction,
    initialState,
  );

  return (
    <section className={`${styles.formContainer}`}>
      {!state?.message ? (
        <>
          <h1>Please response!</h1>

          <p>Hello, {props.actionDefinition.approver}!</p>
          <p>{props.actionDefinition.textTemplate}</p>
          <p>Context: {props.scenarioEntity.context}</p>

          <form action={dispatch}>
            <button name="reject" value="pressed">
              Reject
            </button>
            <button name="approve" value="pressed">
              Approve
            </button>
            <input
              name="historyId"
              value={props.scenarioEntityHistory.historyId || ''}
              hidden={true}
              readOnly={true}
            />
          </form>
        </>
      ) : (
        <p>{state?.message}</p>
      )}

      <p
        className={styles.small}
      >{`scenarioEntityId: ${props.scenarioEntity.scenarioEntityId}`}</p>
    </section>
  );
}

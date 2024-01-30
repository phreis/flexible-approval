'use client';
// Modal as a separate component
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { deleteScenarioAction } from '../../../lib/actions';

type Props = {
  openModal: boolean;
  closeModal: () => void;
  scenarioId: ScenarioHeaderType['scenarioId'];
};

export default function ScenarioDeleteModal({
  openModal,
  closeModal,
  scenarioId,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(deleteScenarioAction, initialState);
  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <>
      <dialog ref={ref} onCancel={closeModal}>
        <p>Are you sure?</p>
        <form action={dispatch}>
          <button>Yes, delete scenario</button>
          <input
            name="scenarioId"
            value={scenarioId || ''}
            hidden={true}
            readOnly={true}
          />
        </form>
        <button onClick={closeModal}>Cancel</button>
      </dialog>
      {/*       <p>{state.message}</p> */}
    </>
  );
}

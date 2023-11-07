'use client';

import { useFormState } from 'react-dom';
import { persistActionResultAction } from '../../lib/actions';
import styles from './ActionForm.module.scss';

export default function ActionForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(
    persistActionResultAction,
    initialState,
  );
  return (
    <section className={`${styles.loginContainer}`}>
      <h1>Please approve or reject</h1>
      <form action={dispatch}>
        <button>Approve</button>
        <button>Reject</button>
        <p>{state?.message}</p>
      </form>
    </section>
  );
}

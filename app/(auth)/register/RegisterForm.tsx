'use client';

import { useFormState } from 'react-dom';
import { registerUser } from '../../lib/actions';
import styles from './RegisterForm.module.scss';

export default function RegisterForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(registerUser, initialState);
  return (
    <section className={`${styles.loginContainer}`}>
      <h1>Sign up</h1>
      <form action={dispatch}>
        <span className={styles.formElement}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" />
        </span>
        <span className={styles.formElement}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </span>
        <span className={styles.formElement}>
          <label htmlFor="pasword">Password </label>
          <input type="password" id="password" name="password" />
        </span>
        <button>Sign up</button>
        <p>{state?.message}</p>
      </form>
      <a className={styles.signUp} href="/login">
        I ALREADY HAVE AN ACCOUNT
      </a>
    </section>
  );
}

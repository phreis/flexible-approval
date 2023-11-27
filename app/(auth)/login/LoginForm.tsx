'use client';

import { useFormState } from 'react-dom';
import { loginUser } from '../../lib/actions';
import styles from './LoginForm.module.scss';

type Props = { returnTo?: string | string[] };

export default function LoginForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(loginUser, initialState);
  return (
    <div className={styles.loginContainer}>
      <h1>Sign in</h1>
      <form action={dispatch}>
        <span className={styles.formElement}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" />
        </span>
        <span className={styles.formElement}>
          <label htmlFor="pasword">Password </label>
          <input type="password" id="password" name="password" />
        </span>
        <input
          name="returnTo"
          value={props.returnTo || ''}
          hidden={true}
          readOnly={true}
        />
        <button>Login</button>
        <p>{state?.message}</p>
      </form>
      <a className={styles.signUp} href="/register">
        Create an account
      </a>
    </div>
  );
}

'use client';

import { useFormState } from 'react-dom';
import { loginUser } from '../../lib/actions';

type Props = { returnTo?: string | string[] };

export default function LoginForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(loginUser, initialState);
  return (
    <form action={dispatch}>
      <label>
        Username
        <input name="username" />
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <input name="returnTo" value={props.returnTo} hidden={true} />
      <button>Register</button>
      <p>{state?.message}</p>
    </form>
  );
}

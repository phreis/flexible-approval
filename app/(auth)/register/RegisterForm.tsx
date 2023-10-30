'use client';

import { useFormState } from 'react-dom';
import { registerUser } from '../../lib/actions';

export default function RegisterForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(registerUser, initialState);
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
      <button>Register</button>
      <p>{state?.message}</p>
    </form>
  );
}

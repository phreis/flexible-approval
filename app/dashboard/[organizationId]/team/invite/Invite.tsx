'use client';
import React, { useRef } from 'react';
import { useFormState } from 'react-dom';
import { OrganizationType } from '../../../../../migrations/00001-createTableOrganizations';
import { preRegisterUserAction } from '../../../../lib/actions';
import styles from './Invite.module.scss';

type Props = {
  orgId: OrganizationType['orgId'];
};

export default function Inviter(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(preRegisterUserAction, initialState);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className={`${styles.loginContainer}`}>
      <form
        /* to clear the form fields after submit */
        ref={ref}
        action={async (formData) => {
          await dispatch(formData);
          ref.current?.reset();
        }}
      >
        <span className={styles.formElement}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" />
        </span>
        <span className={styles.formElement}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" />
        </span>
        <span className={styles.formElement}>
          <label htmlFor="role">Role</label>
          <select id="role" name="role">
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </span>
        <button>Invite</button>
        <p>{state?.message}</p>
      </form>
    </div>
  );
}

'use client';

import { useFormState } from 'react-dom';
import { InvitationType } from '../../../../migrations/00018-createTableInvitations';
import { rsvpAction } from '../../../lib/actions';
import styles from './RsvpForm.module.scss';

type Props = {
  invitation: InvitationType;
};

export default function RsvpForm(props: Props) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(rsvpAction, initialState);

  return (
    <div className={styles.formContainer}>
      <p>
        Hello, <strong>{props.invitation.username}</strong>!
      </p>
      <p>You have been invited to join Flexible Approve!</p>
      <p>Please set your personal password here:</p>

      <form action={dispatch}>
        <span className={styles.formElement}>
          <label htmlFor="password">Password </label>
          <input type="password" id="password" name="password" />
        </span>
        <span className={styles.formElement}>
          <label htmlFor="repassword">Repeat password </label>
          <input type="password" id="repassword" name="repassword" />
        </span>
        <input
          name="invitationId"
          value={props.invitation.invitationId || ''}
          hidden={true}
          readOnly={true}
        />
        <span className={styles.formElement}>
          <button>Login</button>
        </span>
      </form>

      <p>{state?.message}</p>

      <p
        className={styles.small}
      >{`invitationId: ${props.invitation.invitationId}`}</p>
    </div>
  );
}

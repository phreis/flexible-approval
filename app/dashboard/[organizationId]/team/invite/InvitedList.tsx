import React, { Fragment } from 'react';
import { getInvitedUsers } from '../../../../../database/invitations';
import { OrganizationType } from '../../../../../migrations/00000-createTableOrganizations';
import { InvitationType } from '../../../../../migrations/00018-createTableInvitations';
import styles from './Invite.module.scss';

export default async function InviteList() {
  const invitedUser = await getInvitedUsers();
  if (invitedUser && invitedUser.length > 0) {
    return (
      <div className={styles.grid}>
        <span>
          <strong>USERNAME</strong>
        </span>
        <span>
          <strong>EMAIL</strong>
        </span>
        <span>
          <strong>ROLE</strong>
        </span>
        <span>
          <strong>INVITATION SENT</strong>
        </span>
        <span>
          <strong>ACCEPTED</strong>
        </span>
        {invitedUser.map((usr: InvitationType) => {
          return (
            <Fragment key={`key-${usr.invitationId}`}>
              <span>{usr.username}</span>
              <span>{usr.email}</span>
              <span>{usr.role}</span>
              <span>{usr.inviteSent.toLocaleString('de')}</span>
              {usr.inviteAccepted ? (
                <span>{usr.inviteAccepted.toLocaleString('de')}</span>
              ) : (
                <span>PENDING</span>
              )}
            </Fragment>
          );
        })}
      </div>
    );
  }
}

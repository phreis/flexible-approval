import React, { Fragment } from 'react';
import { getUserByOrganization } from '../../../../database/users';
import { OrganizationType } from '../../../../migrations/00001-createTableOrganizations';
import { User } from '../../../../migrations/00007-createTableUsers';
import styles from './TeamList.module.scss';

type Props = {
  orgId: OrganizationType['orgId'];
};

export default async function TeamList(props: Props) {
  const users = await getUserByOrganization(props.orgId);

  return (
    <div className={styles.grid}>
      <span>
        <strong>ID</strong>
      </span>
      <span>
        <strong>USERNAME</strong>
      </span>
      <span>
        <strong>EMAIL</strong>
      </span>
      <span>
        <strong>ROLE</strong>
      </span>

      {users.map((usr: User) => {
        return (
          <Fragment key={`key-${usr.id}`}>
            <span>{usr.id}</span>
            <span>{usr.username}</span>
            <span>{usr.email}</span>
            <span>{usr.role}</span>
          </Fragment>
        );
      })}
    </div>
  );
}

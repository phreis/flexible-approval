import { cache } from 'react';
import { sql } from '../database/connect';
import { OrganizationType } from '../migrations/00000-createTableOrganizations';
import { User } from '../migrations/00005-createTableUsers';
import { ActionDefinitionType } from '../migrations/00011-createTableActionDefinitions';

export type UserWithPasswordHash = User & {
  passwordHash: string;
};

export const createUser = cache(
  async (
    orgId: number,
    username: string,
    passwordHash: string,
    email: string,
    role: string,
  ) => {
    const [user] = await sql<User[]>`
      INSERT INTO
        users (
          org_id,
          username,
          password_hash,
          email,
          role
        )
      VALUES
        (
          ${orgId},
          ${username.toLowerCase()},
          ${passwordHash},
          ${email},
          ${role}
        ) RETURNING org_id,
        id,
        username,
        email,
        role
    `;
    return user;
  },
);

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<User[]>`
    SELECT
      id,
      org_id,
      username,
      email,
      role
    FROM
      users
    WHERE
      username = ${username.toLowerCase()}
  `;
  return user;
});

export const getUserByOrganization = cache(
  async (orgId: OrganizationType['orgId']) => {
    return await sql<User[]>`
      SELECT
        id,
        org_id,
        username,
        email,
        role
      FROM
        users
      WHERE
        org_id = ${orgId}
    `;
  },
);

export const getUserWithPasswordHashByUsername = cache(
  async (username: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
      SELECT
        *
      FROM
        users
      WHERE
        username = ${username.toLowerCase()}
    `;
    return user;
  },
);

export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.username,
      users.org_id,
      users.email,
      users.role
    FROM
      users
      INNER JOIN sessions ON (
        sessions.token = ${token}
        AND sessions.user_id = users.id
        AND sessions.org_id = users.org_id
        AND sessions.expiry_timestamp > now ()
      )
  `;
  return user;
});

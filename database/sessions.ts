import { cache } from 'react';
import { sql } from '../database/connect';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { Session } from '../migrations/00015-createTableSessions';

export const deleteExpiredSessions = cache(async () => {
  await sql`
    DELETE FROM sessions
    WHERE
      expiry_timestamp < now ()
  `;
});

export const createSession = cache(
  async (userId: number, token: string, orgId: OrganizationType['orgId']) => {
    const [session] = await sql<Session[]>`
      INSERT INTO
        sessions (user_id, token, org_id)
      VALUES
        (
          ${userId},
          ${token},
          ${orgId}
        ) RETURNING id,
        token,
        user_id,
        org_id
    `;

    await deleteExpiredSessions();

    return session;
  },
);

export const deleteSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    DELETE FROM sessions
    WHERE
      sessions.token = ${token} RETURNING id,
      token
  `;

  return session;
});

export const getValidSessionByToken = cache(async (token: string) => {
  const [session] = await sql<{ id: number; token: string }[]>`
    SELECT
      sessions.id,
      sessions.token
    FROM
      sessions
    WHERE
      sessions.token = ${token}
      AND sessions.expiry_timestamp > now ()
  `;

  return session;
});

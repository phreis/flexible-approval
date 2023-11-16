import { cache } from 'react';
import { sql } from '../database/connect';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { User } from '../migrations/00007-createTableUsers';
import { InvitationType } from '../migrations/00018-createTableInvitations';
import { getOrganizationLoggedIn } from './organizations';

type CreateInvitationType = {
  email: User['email'];
  username: User['username'];
  role: User['role'];
};

export async function getInvitedUsers(): Promise<InvitationType[] | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getInvitedUsersByOrgId(orgId);
  }
}

export const getInvitedUsersByOrgId = cache(
  async (orgId: OrganizationType['orgId']) => {
    const invitations = await sql<InvitationType[]>`
      SELECT
        *
      FROM
        invitations
      WHERE
        org_id = ${orgId}
      ORDER BY
        invite_sent DESC
    `;
    return invitations;
  },
);

export const getInvitationById = cache(
  async (invitationId: InvitationType['invitationId']) => {
    const [invitation] = await sql<InvitationType[]>`
      SELECT
        *
      FROM
        invitations
      WHERE
        invitation_id = ${invitationId}
      ORDER BY
        invite_sent DESC
    `;
    return invitation;
  },
);

// no orgId here, b/c username has to be unique over all orgs
export const getInvitedUsersByUsername = cache(
  async (username: InvitationType['username']) => {
    const [invitation] = await sql<InvitationType[]>`
      SELECT
        *
      FROM
        invitations
      WHERE
        username = ${username}
    `;
    return invitation;
  },
);

export async function acceptInvitation(
  invitationId: InvitationType['invitationId'],
): Promise<InvitationType | undefined> {
  const [accepted] = await sql<InvitationType[]>`
    UPDATE invitations
    SET
      invite_accepted = NOW ()
    WHERE
      invitation_id = ${invitationId} RETURNING *
  `;
  return accepted;
}

export async function createInvitation(
  invitation: CreateInvitationType,
): Promise<InvitationType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return createInvitationWithOrgId(invitation, orgId);
  }
}

const createInvitationWithOrgId = cache(
  async (
    invitation: CreateInvitationType,
    orgId: OrganizationType['orgId'],
  ) => {
    const { email, username, role } = invitation;
    const [invite] = await sql<InvitationType[]>`
      INSERT INTO
        invitations (
          invitation_id,
          org_id,
          username,
          email,
          role
        )
      VALUES
        (
          ${crypto.randomUUID()},
          ${orgId},
          ${username.toLowerCase()},
          ${email},
          ${role}
        ) RETURNING *
    `;
    return invite;
  },
);

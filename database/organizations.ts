import { cache } from 'react';
import { getUserLoggedIn } from '../app/lib/utils';
import { sql } from '../database/connect';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { User } from '../migrations/00007-createTableUsers';

export const createOrganization = cache(async (name: string) => {
  const [organization] = await sql<OrganizationType[]>`
    INSERT INTO
      organizations (name)
    VALUES
      (
        ${name}
      ) RETURNING org_id,
      name
  `;
  return organization;
});

export const getOrganizationById = cache(
  async (OrgId: OrganizationType['orgId']) => {
    const [organization] = await sql<OrganizationType[]>`
      SELECT
        *
      FROM
        organizations
      WHERE
        org_id = ${OrgId}
    `;
    return organization;
  },
);

export const getOrganizationByUserName = cache(
  async (username: User['username']) => {
    const [organization] = await sql<OrganizationType[]>`
      SELECT
        organizations.org_id,
        organizations.name
      FROM
        organizations
        JOIN users ON organizations.org_id = users.org_id
      WHERE
        users.username = ${username}
    `;
    return organization;
  },
);

export async function getOrganizationLoggedIn() {
  const userLoggedIn = await getUserLoggedIn();
  let organizationLoggedIn;
  if (userLoggedIn) {
    return (organizationLoggedIn = await getOrganizationByUserName(
      userLoggedIn.username,
    ));
  }
}

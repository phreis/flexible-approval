import 'server-only';
import { Andada_Pro } from 'next/font/google';
import { headers } from 'next/headers';
import { cache } from 'react';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import { ScenarioItemType } from '../migrations/00005-createTableScenarioItems';
import { sql } from './connect';
import { getOrganizationLoggedIn } from './organizations';

export async function getScenarioHeaderById(
  scenarioId: ScenarioHeaderType['scenarioId'],
): Promise<ScenarioHeaderType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioHeaderByIdOrgId(scenarioId, orgId);
  }
}

const getScenarioHeaderByIdOrgId = cache(
  async (
    scenarioId: ScenarioHeaderType['scenarioId'],
    orgId: OrganizationType['orgId'],
  ) => {
    const [scenario] = await sql<ScenarioHeaderType[]>`
      SELECT
        *
      FROM
        scenarioheader
      WHERE
        scenario_id = ${scenarioId}
        AND org_id = ${orgId};
    `;
    return scenario;
  },
);

export async function getScenarioHeaders(): Promise<
  ScenarioHeaderType[] | undefined
> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioHeadersByOrgId(orgId);
  }
}

const getScenarioHeadersByOrgId = cache(
  async (orgId: OrganizationType['orgId']) => {
    return await sql<ScenarioHeaderType[]>`
      SELECT
        *
      FROM
        scenarioheader
      WHERE
        org_id = ${orgId};
    `;
  },
);

export async function getScenarioItems(
  scenarioId: ScenarioHeaderType['scenarioId'],
): Promise<ScenarioItemType[] | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioItemsByOrgId(scenarioId, orgId);
  }
}

export const getScenarioItemsByOrgId = cache(
  async (
    scenarioId: ScenarioHeaderType['scenarioId'],
    orgId: OrganizationType['orgId'],
  ) => {
    return await sql<ScenarioItemType[]>`
      SELECT
        *
      FROM
        scenarioitems
      WHERE
        scenario_id = ${scenarioId}
        AND org_id = ${orgId}
      ORDER BY
        scenario_id ASC,
        step_id ASC;
    `;
  },
);

type CreateScenarioHeaderType = {
  description: ScenarioHeaderType['description'];
};

export async function createScenario(
  scenarioHeader: CreateScenarioHeaderType,
): Promise<ScenarioHeaderType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return createScenarioWithOrgId(scenarioHeader, orgId);
  }
}

const createScenarioWithOrgId = cache(
  async (
    scenarioHeader: CreateScenarioHeaderType,
    orgId: OrganizationType['orgId'],
  ) => {
    const { description } = scenarioHeader;
    const [invite] = await sql<ScenarioHeaderType[]>`
      INSERT INTO
        scenarioheader (
          org_id,
          description
        )
      VALUES
        (
          ${orgId},
          ${description}
        ) RETURNING *
    `;
    return invite;
  },
);

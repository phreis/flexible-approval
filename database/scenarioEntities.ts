import { cache } from 'react';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { ScenarioEntityType } from '../migrations/00016-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../migrations/00017-createTablescenarioEntityHistory';
import { sql } from './connect';
import { getOrganizationLoggedIn } from './organizations';

type CreateScenatioEntityType = {
  scenarioId: ScenarioEntityType['scenarioId'];
  orgId: OrganizationType['orgId'];
  context: ScenarioEntityType['context'] | undefined;
};

export const createScenarioEntity = cache(
  async (createScenarioEntityParam: CreateScenatioEntityType) => {
    const { scenarioId, orgId, context } = createScenarioEntityParam;
    const [scenarioEntiy] = await sql<ScenarioEntityType[]>`
      INSERT INTO
        scenarioentities (
          scenario_entity_id,
          scenario_id,
          org_id,
          context
        )
      VALUES
        (
          ${crypto.randomUUID()},
          ${scenarioId},
          ${orgId},
          ${context || null}
        ) RETURNING *
    `;

    return scenarioEntiy;
  },
);

const getScenarioEntityByIdOrgId = cache(
  async (
    scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
    orgId: OrganizationType['orgId'],
  ) => {
    return await sql<ScenarioEntityType[]>`
      SELECT
        *
      FROM
        scenarioentities
      WHERE
        scenario_entity_id = ${scenarioEntityId}
        AND org_id = ${orgId}
    `;
  },
);
export async function getScenarioEntityById(
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
): Promise<ScenarioEntityType[] | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioEntityByIdOrgId(scenarioEntityId, orgId);
  }
}
export type ScenarioEntityListType = {
  scenarioId: ScenarioEntityType['scenarioId'];
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  creationdate: ScenarioEntityType['creationdate'];
  context: ScenarioEntityType['context'];
  state: ScenarioEntityHistoryType['state'] | string;
  message: ScenarioEntityHistoryType['message'];
  orgId: OrganizationType['orgId'];
};

// Selects all entityItems of on specific scenarioId with its latest history state and message
// read sql from inside out!!
export const getScenarioEntitiesListByScenarioId = cache(
  async (
    scenarioId: ScenarioEntityType['scenarioId'],
    orgId: OrganizationType['orgId'],
    filter: string | undefined,
  ) => {
    if (filter === 'incomplete') {
      return await sql<ScenarioEntityListType[]>`
        SELECT
          scenarioentities.scenario_id,
          scenarioentities.scenario_entity_id,
          scenarioentities.org_id,
          scenarioentities.creationdate,
          scenarioentities.context,
          history.state,
          history.message
        FROM
          scenarioentities
          JOIN (
            SELECT
              scenario_entity_id,
              creationdate,
              state,
              message
            FROM
              scenarioentityhistory outerr
            WHERE
              creationdate = (
                SELECT
                  MAX(
                    creationdate
                  )
                FROM
                  scenarioentityhistory
                WHERE
                  scenario_entity_id = outerr.scenario_entity_id
                GROUP BY
                  scenario_entity_id
              )
          ) AS history ON scenarioentities.scenario_entity_id = history.scenario_entity_id
        WHERE
          scenarioentities.scenario_id = ${scenarioId}
          AND scenarioentities.org_id = ${orgId}
          AND (
            history.state <> 'DONE'
          )
        ORDER BY
          creationdate DESC
      `;
    } else {
      return await sql<ScenarioEntityListType[]>`
        SELECT
          scenarioentities.scenario_id,
          scenarioentities.scenario_entity_id,
          scenarioentities.org_id,
          scenarioentities.creationdate,
          scenarioentities.context,
          history.state,
          history.message
        FROM
          scenarioentities
          JOIN (
            SELECT
              scenario_entity_id,
              creationdate,
              state,
              message
            FROM
              scenarioentityhistory outerr
            WHERE
              creationdate = (
                SELECT
                  MAX(
                    creationdate
                  )
                FROM
                  scenarioentityhistory
                WHERE
                  scenario_entity_id = outerr.scenario_entity_id
                GROUP BY
                  scenario_entity_id
              )
          ) AS history ON scenarioentities.scenario_entity_id = history.scenario_entity_id
        WHERE
          scenarioentities.scenario_id = ${scenarioId}
          AND scenarioentities.org_id = ${orgId}
        ORDER BY
          creationdate DESC
      `;
    }
  },
);

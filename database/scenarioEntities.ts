import { cache } from 'react';
import { ScenarioEntityType } from '../migrations/00015-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../migrations/00017-createTablescenarioEntityHistory';
import { sql } from './connect';

type CreateScenatioEntityType = {
  scenarioId: ScenarioEntityType['scenarioId'];
  context: ScenarioEntityType['context'] | undefined;
};

export const createScenarioEntity = cache(
  async (createScenarioEntityParam: CreateScenatioEntityType) => {
    const { scenarioId, context } = createScenarioEntityParam;
    const [scenarioEntiy] = await sql<ScenarioEntityType[]>`
      INSERT INTO
        scenarioentities (
          scenario_entity_id,
          scenario_id,
          context
        )
      VALUES
        (
          ${crypto.randomUUID()},
          ${scenarioId},
          ${context || null}
        ) RETURNING *
    `;

    return scenarioEntiy;
  },
);

export const getScenarioEntityById = cache(
  async (scenarioEntityId: ScenarioEntityType['scenarioEntityId']) => {
    const [scenarioEntiy] = await sql<ScenarioEntityType[]>`
      SELECT
        *
      FROM
        scenarioentities
      WHERE
        scenario_entity_id = ${scenarioEntityId}
    `;

    return scenarioEntiy;
  },
);

export const getScenarioEntitiesByScenarioId = cache(
  async (scenarioId: ScenarioEntityType['scenarioId']) => {
    return await sql<ScenarioEntityType[]>`
      SELECT
        *
      FROM
        scenarioentities
      WHERE
        scenario_id = ${scenarioId}
    `;
  },
);

export type ScenarioEntityListType = {
  scenarioId: ScenarioEntityType['scenarioId'];
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  creationdate: ScenarioEntityType['creationdate'];
  context: ScenarioEntityType['context'];
  state: ScenarioEntityHistoryType['state'] | string;
  message: ScenarioEntityHistoryType['message'];
};

// Selects all entityItems of on specific scenarioId with its latest history state and message
// read sql from inside out!!
export const getScenarioEntitiesListByScenarioId = cache(
  async (
    scenarioId: ScenarioEntityType['scenarioId'],
    filter: string | undefined,
  ) => {
    if (filter === 'incomplete') {
      return await sql<ScenarioEntityListType[]>`
        SELECT
          scenarioentities.scenario_id,
          scenarioentities.scenario_entity_id,
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
          AND (
            history.state = 'PENDING'
            OR history.state = 'ERROR'
          )
        ORDER BY
          creationdate DESC
      `;
    } else {
      return await sql<ScenarioEntityListType[]>`
        SELECT
          scenarioentities.scenario_id,
          scenarioentities.scenario_entity_id,
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
        ORDER BY
          creationdate DESC
      `;
    }
  },
);

import { cache } from 'react';
import { ScenarioEntityType } from '../migrations/00015-createTablescenarioEntities';
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

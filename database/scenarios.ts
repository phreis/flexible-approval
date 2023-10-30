import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import { ScenarioHeaderType } from '../migrations/00001-createTableScenarioHeader';
import { ScenarioItemType } from '../migrations/00003-createTableScenarioItems';
import { sql } from './connect';

export const getScenarioHeaderById = cache(
  async (scenarioId: ScenarioHeaderType['scenarioId']) => {
    return await sql<ScenarioHeaderType[]>`
SELECT * FROM scenarioheader where scenario_id = ${scenarioId};
  `;
  },
);

export const getScenarioHeaders = cache(async () => {
  return await sql<ScenarioHeaderType[]>`
SELECT * FROM scenarioheader;
  `;
});

export const getScenarioItems = cache(
  async (scenarioId: ScenarioHeaderType['scenarioId']) => {
    return await sql<ScenarioItemType[]>`
SELECT * FROM scenarioitems where scenario_id = ${scenarioId}
ORDER BY scenario_id ASC, step_id ASC ;
  `;
  },
);
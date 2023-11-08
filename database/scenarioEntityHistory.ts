import { cache } from 'react';
import { getUserLoggedIn } from '../app/lib/utils';
import { ScenarioHeaderType } from '../migrations/00001-createTableScenarioHeader';
import { ScenarioItemType } from '../migrations/00003-createTableScenarioItems';
import { ScenarioEntityType } from '../migrations/00015-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../migrations/00017-createTablescenarioEntityHistory';
import { sql } from './connect';

export type CreateScenarioEntityHistoryType = {
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: ScenarioItemType['stepId'];
  taskType: ScenarioItemType['taskType'];
  taskId: ScenarioItemType['taskId'] | null;
  condResult: ScenarioItemType['condStepResult'] | null;
  actionResult: ScenarioItemType['actionStepResult'] | null;
  state: ScenarioEntityHistoryType['state'];
  message: ScenarioEntityHistoryType['message'];
};

export const getScenarioEntityHistoryLatest = cache(
  async (
    scenarioId: ScenarioHeaderType['scenarioId'],
    scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
    stepId: number,
  ) => {
    const [scenarioEntiyHistoryLatest] = await sql<ScenarioEntityHistoryType[]>`
      SELECT
        *
      FROM
        scenarioentityhistory
      WHERE
        scenario_entity_id = ${scenarioEntityId}
        AND scenario_id = ${scenarioId}
        AND step_id = ${stepId}
      ORDER BY
        creationdate DESC
      LIMIT
        1
    `;
    return scenarioEntiyHistoryLatest;
  },
);

export const createScenarioEntityHistory = cache(
  async (createScenarioEntityHistoryParam: CreateScenarioEntityHistoryType) => {
    const user = await getUserLoggedIn();
    const {
      scenarioEntityId,
      scenarioId,
      stepId,
      taskType,
      taskId,
      condResult,
      actionResult,
      state,
      message,
    } = createScenarioEntityHistoryParam;
    const [scenarioEntiyHistory] = await sql<ScenarioEntityHistoryType[]>`
      INSERT INTO
        scenarioentityhistory (
          history_id,
          scenario_entity_id,
          scenario_id,
          step_id,
          task_type,
          task_id,
          cond_result,
          action_result,
          state,
          message,
          username
        )
      VALUES
        (
          ${crypto.randomUUID()},
          ${scenarioEntityId},
          ${scenarioId},
          ${stepId},
          ${taskType},
          ${taskId},
          ${condResult},
          ${actionResult},
          ${state},
          ${message},
          ${user?.username || ''}
        ) RETURNING *
    `;

    return scenarioEntiyHistory;
  },
);

export const getScenarioEntityHistoriesById = cache(
  async (scenarioEntityId: ScenarioEntityType['scenarioEntityId']) => {
    return await sql<ScenarioEntityHistoryType[]>`
      SELECT
        *
      FROM
        scenarioentityhistory
      WHERE
        scenario_entity_id = ${scenarioEntityId}
    `;
  },
);

export const getScenarioEntityHistoryByHistoryId = cache(
  async (historyId: ScenarioEntityHistoryType['historyId']) => {
    return await sql<ScenarioEntityHistoryType[]>`
      SELECT
        *
      FROM
        scenarioentityhistory
      WHERE
        history_id = ${historyId}
    `;
  },
);

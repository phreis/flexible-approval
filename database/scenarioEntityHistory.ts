import { cache } from 'react';
import { getUserLoggedIn } from '../app/lib/utils';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import {
  PreStepcomparativeValue,
  ScenarioItemType,
} from '../migrations/00005-createTableScenarioItems';
import { ScenarioEntityType } from '../migrations/00016-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../migrations/00017-createTablescenarioEntityHistory';
import { sql } from './connect';
import { getOrganizationLoggedIn } from './organizations';

export type CreateScenarioEntityHistoryType = {
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: ScenarioItemType['stepId'];
  taskType: ScenarioItemType['taskType'];
  taskId: ScenarioItemType['taskId'] | null;
  preStepComparativeValue: PreStepcomparativeValue;
  state: ScenarioEntityHistoryType['state'];
  message: ScenarioEntityHistoryType['message'];
};

const getScenarioEntityHistoryLatestByOrgId = cache(
  async (
    scenarioId: ScenarioHeaderType['scenarioId'],
    scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
    stepId: number,
    orgId: OrganizationType['orgId'],
  ) => {
    const [historyEntry] = await sql<ScenarioEntityHistoryType[]>`
      SELECT
        *
      FROM
        scenarioentityhistory
      WHERE
        scenario_entity_id = ${scenarioEntityId}
        AND scenario_id = ${scenarioId}
        AND step_id = ${stepId}
        AND org_id = ${orgId}
      ORDER BY
        creationdate DESC
      LIMIT
        1
    `;
    return historyEntry;
  },
);
export async function getScenarioEntityHistoryLatest(
  scenarioId: ScenarioHeaderType['scenarioId'],
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
  stepId: number,
) {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return await getScenarioEntityHistoryLatestByOrgId(
      scenarioId,
      scenarioEntityId,
      stepId,
      orgId,
    );
  }
}

export const createScenarioEntityHistoryWithOrgId = cache(
  async (
    createScenarioEntityHistoryParam: CreateScenarioEntityHistoryType,
    orgId: OrganizationType['orgId'],
  ) => {
    const user = await getUserLoggedIn();
    const {
      scenarioEntityId,
      scenarioId,
      stepId,
      taskType,
      taskId,
      preStepComparativeValue,
      state,
      message,
    } = createScenarioEntityHistoryParam;
    const [historyEntry] = await sql<ScenarioEntityHistoryType[]>`
      INSERT INTO
        scenarioentityhistory (
          history_id,
          scenario_entity_id,
          scenario_id,
          org_id,
          step_id,
          task_type,
          task_id,
          pre_step_comparative_value,
          state,
          message,
          username
        )
      VALUES
        (
          ${crypto.randomUUID()},
          ${scenarioEntityId},
          ${scenarioId},
          ${orgId},
          ${stepId},
          ${taskType},
          ${taskId},
          ${preStepComparativeValue},
          ${state},
          ${message},
          ${user?.username || ''}
        ) RETURNING *
    `;
    return historyEntry;
  },
);
export async function createScenarioEntityHistory(
  createScenarioEntityHistoryParam: CreateScenarioEntityHistoryType,
): Promise<ScenarioEntityHistoryType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return createScenarioEntityHistoryWithOrgId(
      createScenarioEntityHistoryParam,
      orgId,
    );
  }
}

const getScenarioEntityHistoriesByIdWithOrgId = cache(
  async (
    scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
    orgId: OrganizationType['orgId'],
  ) => {
    return await sql<ScenarioEntityHistoryType[]>`
      SELECT
        *
      FROM
        scenarioentityhistory
      WHERE
        scenario_entity_id = ${scenarioEntityId}
        AND org_id = ${orgId}
    `;
  },
);
export async function getScenarioEntityHistoriesById(
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'],
): Promise<ScenarioEntityHistoryType[] | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioEntityHistoriesByIdWithOrgId(scenarioEntityId, orgId);
  }
}

const getScenarioEntityHistoryByHistoryIdWithOrgId = cache(
  async (
    historyId: ScenarioEntityHistoryType['historyId'],
    orgId: OrganizationType['orgId'],
  ) => {
    const [scenarioHistory] = await sql<ScenarioEntityHistoryType[]>`
      SELECT
        *
      FROM
        scenarioentityhistory
      WHERE
        history_id = ${historyId}
        AND org_id = ${orgId}
    `;
    return scenarioHistory;
  },
);
export async function getScenarioEntityHistoryByHistoryId(
  historyId: ScenarioEntityHistoryType['historyId'],
): Promise<ScenarioEntityHistoryType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioEntityHistoryByHistoryIdWithOrgId(historyId, orgId);
  }
}

import 'server-only';
import { cache } from 'react';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import {
  PreStepcomparativeValue,
  ScenarioItemType,
} from '../migrations/00005-createTableScenarioItems';
import { sql } from './connect';
import { getOrganizationLoggedIn } from './organizations';

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
export async function getScenarioHeaderById(
  scenarioId: ScenarioHeaderType['scenarioId'],
): Promise<ScenarioHeaderType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioHeaderByIdOrgId(scenarioId, orgId);
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
export async function getScenarioHeaders(): Promise<
  ScenarioHeaderType[] | undefined
> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioHeadersByOrgId(orgId);
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
export async function getScenarioItems(
  scenarioId: ScenarioHeaderType['scenarioId'],
): Promise<ScenarioItemType[] | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return getScenarioItemsByOrgId(scenarioId, orgId);
  }
}
type CreateScenarioHeaderType = {
  description: ScenarioHeaderType['description'];
};

const createScenarioWithOrgId = cache(
  async (
    scenarioHeader: CreateScenarioHeaderType,
    orgId: OrganizationType['orgId'],
  ) => {
    const { description } = scenarioHeader;
    const [scenario] = await sql<ScenarioHeaderType[]>`
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
    return scenario;
  },
);
export async function createScenario(
  scenarioHeader: CreateScenarioHeaderType,
): Promise<ScenarioHeaderType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return createScenarioWithOrgId(scenarioHeader, orgId);
  }
}
export type UpdateScenarioHeaderType = {
  orgId: OrganizationType['orgId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: ScenarioHeaderType['description'];
  contextDataDescription: ScenarioHeaderType['contextDataDescription'];
};

export const updateScenarioHeader = cache(
  async (scenarioHeader: UpdateScenarioHeaderType) => {
    const { orgId, scenarioId, description, contextDataDescription } =
      scenarioHeader;
    const [scenario] = await sql<ScenarioHeaderType[]>`
      UPDATE scenarioheader
      SET
        description = ${description},
        context_data_description = ${contextDataDescription}
      WHERE
        org_id = ${orgId}
        AND scenario_id = ${scenarioId} RETURNING *
    `;
    return scenario;
  },
);

export type CreateScenarioItemType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  parentStepId?: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId?: number | null;
  preStepComparativeValue?: PreStepcomparativeValue;
};

const createScenarioItemWithOrgId = cache(
  async (
    scenarioItem: CreateScenarioItemType,
    orgId: OrganizationType['orgId'],
  ) => {
    const {
      scenarioId,
      parentStepId,
      taskType,
      taskId,
      preStepComparativeValue,
    } = scenarioItem;
    const [item] = await sql<ScenarioItemType[]>`
      INSERT INTO
        scenarioitems (
          org_id,
          scenario_id,
          parent_step_id,
          task_type,
          task_id,
          pre_step_comparative_value
        )
      VALUES
        (
          ${orgId},
          ${scenarioId},
          ${parentStepId},
          ${taskType},
          ${taskId},
          ${preStepComparativeValue}
        ) RETURNING *
    `;
    return item;
  },
);

export async function createScenarioItem(
  scenarioItem: CreateScenarioItemType,
): Promise<ScenarioItemType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (orgId) {
    return createScenarioItemWithOrgId(scenarioItem, orgId);
  }
}
type DeleteScenarioType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
};

const deleteScenarioWithOrgId = cache(
  async (
    scenarioHeader: DeleteScenarioType,
    orgId: OrganizationType['orgId'],
  ) => {
    const { scenarioId } = scenarioHeader;
    console.log('scenarioId: ', scenarioId, 'orgId: ', orgId);
    const [scenario] = await sql<ScenarioHeaderType[]>`
      DELETE FROM scenarioheader
      WHERE
        org_id = ${orgId}
        AND scenario_id = ${scenarioId} RETURNING *
    `;

    return scenario;
  },
);
export async function deleteScenario(
  scenarioHeader: DeleteScenarioType,
): Promise<ScenarioHeaderType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;

  if (orgId) {
    return deleteScenarioWithOrgId(scenarioHeader, orgId);
  }
}

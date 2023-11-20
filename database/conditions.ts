import 'server-only';
import { cache } from 'react';
import { OrganizationType } from '../migrations/00001-createTableOrganizations';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import { ConditionHeaderType } from '../migrations/00008-createTableConditionHeader';
import { ConditionItemType } from '../migrations/00010-createTableConditionItems';
import { sql } from './connect';
import { getOrganizationLoggedIn } from './organizations';

export const getCondtitionHeaderById = cache(
  async (conditionId: ConditionHeaderType['conditionId']) => {
    return await sql<ConditionHeaderType[]>`
      SELECT
        *
      FROM
        conditionheader
      WHERE
        condition_id = ${conditionId};
    `;
  },
);

export const getConditionHeaders = cache(async () => {
  return await sql<ConditionHeaderType[]>`
    SELECT
      *
    FROM
      conditionheader;
  `;
});

export const getConditionItems = cache(
  async (conditionId: ConditionHeaderType['conditionId']) => {
    return await sql<ConditionItemType[]>`
      SELECT
        *
      FROM
        conditionitems
      WHERE
        condition_id = ${conditionId}
      ORDER BY
        condition_id ASC,
        condition_item_id ASC;
    `;
  },
);

export type CreateConditionHeaderType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: string;
};

export async function createConditionHeader(
  condHeader: CreateConditionHeaderType,
): Promise<ConditionHeaderType | undefined> {
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;

  if (orgId) {
    return createConditionHeaderWithOrgId(condHeader, orgId);
  }
}

const createConditionHeaderWithOrgId = cache(
  async (
    condHeader: CreateConditionHeaderType,
    orgId: OrganizationType['orgId'],
  ) => {
    const { scenarioId, description } = condHeader;
    const [condition] = await sql<ConditionHeaderType[]>`
      INSERT INTO
        conditionheader (
          scenario_id,
          description
        )
      VALUES
        (
          ${scenarioId},
          ${description}
        ) RETURNING *
    `;
    return condition;
  },
);

export type CreateConditionItemType = {
  conditionId: ConditionHeaderType['conditionId'];
  contextAttributeName: ConditionItemType['contextAttributeName'];
  comperator: ConditionItemType['comperator'] | string;
  compConstant: ConditionItemType['compConstant'];
  linkConditionNext: 'AND' | 'OR' | null;
};
export const createConditionItem = cache(
  async (condItem: CreateConditionItemType) => {
    const {
      conditionId,
      contextAttributeName,
      comperator,
      compConstant,
      linkConditionNext,
    } = condItem;
    const [conditionItem] = await sql<ConditionHeaderType[]>`
      INSERT INTO
        conditionitems (
          condition_id,
          context_attribute_name,
          comperator,
          comp_constant,
          link_condition_next
        )
      VALUES
        (
          ${conditionId},
          ${contextAttributeName},
          ${comperator},
          ${compConstant},
          ${linkConditionNext}
        )
    `;
    return conditionItem;
  },
);

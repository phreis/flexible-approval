import 'server-only';
import { cache } from 'react';
import { ConditionHeaderType } from '../migrations/00007-createTableConditionHeader';
import { ConditionItemType } from '../migrations/00009-createTableConditionItems';
import { sql } from './connect';

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

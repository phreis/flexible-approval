import { Sql } from 'postgres';
import { ConditionItemType } from './00010-createTableConditionItems';

const conditionitems: ConditionItemType[] = [
  /*   {
    conditionId: 1,
    conditionItemId: 1,
    contextAttributeName: 'amountToApprove',
    comperator: '>',
    compConstant: 1000,
    linkConditionNext: null,
  },
  {
    conditionId: 2,
    conditionItemId: 1,
    contextAttributeName: 'amountToApprove',
    comperator: '<',
    compConstant: 1000,
    linkConditionNext: null,
  },
  {
    conditionId: 3,
    conditionItemId: 1,
    contextAttributeName: 'amountToApprove',
    comperator: '<',
    compConstant: 500,
    linkConditionNext: null,
  },
  {
    conditionId: 4,
    conditionItemId: 1,
    contextAttributeName: 'amountToApprove',
    comperator: '<',
    compConstant: 2000,
    linkConditionNext: null,
  },
  {
    conditionId: 5,
    conditionItemId: 1,
    contextAttributeName: 'amountToApprove',
    comperator: '>',
    compConstant: 5000,
    linkConditionNext: null,
  }, */
];

export async function up(sql: Sql) {
  for (const item of conditionitems) {
    await sql`
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
          ${item.conditionId},
          ${item.contextAttributeName},
          ${item.comperator},
          ${item.compConstant},
          ${item.linkConditionNext}
        )
    `;
  }
}

export async function down(sql: Sql) {
  for (const item of conditionitems) {
    await sql`
      DELETE FROM conditionitems
      WHERE
        condition_id = ${item.conditionId}
        AND condition_item_id = ${item.conditionItemId}
    `;
  }
}

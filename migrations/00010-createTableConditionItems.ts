import { Sql } from 'postgres';
import { ConditionHeaderType } from './00008-createTableConditionHeader';

export type ConditionItemType = {
  conditionId: ConditionHeaderType['conditionId'];
  conditionItemId: number;
  contextAttributeName: string | null;
  comperator: string | null;
  compConstant: number | null;
  linkConditionNext: string | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      conditionitems (
        condition_id INTEGER NOT NULL REFERENCES conditionheader (
          condition_id
        ) ON DELETE CASCADE,
        condition_item_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
        context_attribute_name VARCHAR(100),
        comperator VARCHAR(10),
        comp_constant INTEGER,
        link_condition_next VARCHAR(3),
        PRIMARY KEY (
          condition_id,
          condition_item_id
        )
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE conditionitems `;
}

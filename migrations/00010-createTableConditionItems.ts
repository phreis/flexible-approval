import { Sql } from 'postgres';
import { ConditionHeaderType } from './00007-createTableConditionHeader';

export type ConditionItemType = {
  conditionId: ConditionHeaderType['conditionId'];
  conditionItemId: number;
  contextAttributeName: string;
  comperator: '<' | '>' | '=';
  compConstant: number;
  linkConditionNext: 'AND' | 'OR' | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE conditionitems (
      condition_id integer NOT NULL references conditionheader (condition_id) ON DELETE CASCADE,
      condition_item_id integer NOT NULL,
      context_attribute_name varchar(100),
      comperator varchar(10),
      comp_constant integer,
      link_condition_next varchar(3),
      PRIMARY KEY(condition_id, condition_item_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE conditionitems
  `;
}

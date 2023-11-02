import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';

const conditionHeader = [
  {
    conditionId: 1,
    description: 'Amount requires approvement?',
  },
];

export async function up(sql: Sql) {
  for (const header of conditionHeader) {
    await sql`
      INSERT INTO conditionHeader
        (condition_id, description)
      VALUES
        (${header.conditionId}, ${header.description} )
  `;
  }
}

export async function down(sql: Sql) {
  for (const header of conditionHeader) {
    await sql`
      DELETE FROM conditionHeader WHERE condition_id = ${header.conditionId}
    `;
  }
}

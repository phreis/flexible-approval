import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';

const conditionHeader = [
  {
    conditionId: 1,
    scenarioId: 1,
    description: 'Amount requires approvement?',
  },
];

export async function up(sql: Sql) {
  for (const header of conditionHeader) {
    await sql`
      INSERT INTO conditionheader
        (scenario_id, description)
      VALUES
        (${header.scenarioId}, ${header.description} )
  `;
  }
}

export async function down(sql: Sql) {
  for (const header of conditionHeader) {
    await sql`
      DELETE FROM conditionheader WHERE condition_id = ${header.conditionId}
    `;
  }
}

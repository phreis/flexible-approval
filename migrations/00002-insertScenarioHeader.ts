import { Sql } from 'postgres';

const scenarioHeader = [
  {
    scenarioId: 1,
    description: 'Basic approval',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    scenarioId: 2,
    description: 'Multi step approval',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
];

export async function up(sql: Sql) {
  for (const header of scenarioHeader) {
    await sql`
      INSERT INTO scenarioheader
        (scenario_id, description, context_data_description)
      VALUES
        (${header.scenarioId}, ${header.description},${header.contextDataDescription} )
  `;
  }
}

export async function down(sql: Sql) {
  for (const header of scenarioHeader) {
    await sql`
      DELETE FROM scenarioheader WHERE scenario_id = ${header.scenarioId}
    `;
  }
}

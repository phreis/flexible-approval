import { Sql } from 'postgres';

const scenarioHeader = [
  {
    scenarioId: 1,
    description: 'Basic approval',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    scenarioId: 3,
    description: 'Basic approval 2',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    scenarioId: 4,
    description: 'Basic approval - Actions',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    scenarioId: 5,
    description: 'Basic approval - Conditions',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
];

export async function up(sql: Sql) {
  for (const header of scenarioHeader) {
    await sql`
      INSERT INTO
        scenarioheader (
          scenario_id,
          description,
          context_data_description
        )
      VALUES
        (
          ${header.scenarioId},
          ${header.description},
          ${header.contextDataDescription}
        )
    `;
  }
}

export async function down(sql: Sql) {
  for (const header of scenarioHeader) {
    await sql`
      DELETE FROM scenarioheader
      WHERE
        scenario_id = ${header.scenarioId}
    `;
  }
}

import { Sql } from 'postgres';

const scenarioHeader = [
  {
    orgId: 1,
    scenarioId: 1,
    description: 'Basic approval',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    orgId: 1,
    scenarioId: 2,
    description: 'Basic approval 2',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    orgId: 2,
    scenarioId: 3,
    description: 'Basic approval - Actions',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
  {
    orgId: 2,
    scenarioId: 4,
    description: 'Basic approval - Conditions',
    contextDataDescription: `'{"amountToApprove":"number"}'`,
  },
];

export async function up(sql: Sql) {
  for (const header of scenarioHeader) {
    await sql`
      INSERT INTO
        scenarioheader (
          org_id,
          description,
          context_data_description
        )
      VALUES
        (
          ${header.orgId},
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
        AND org_id = ${header.orgId}
    `;
  }
}

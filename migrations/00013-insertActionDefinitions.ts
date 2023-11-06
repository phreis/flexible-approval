import { Sql } from 'postgres';

const actiondefinitions = [
  {
    actionId: 1,
    scenarioId: 1,
    description: 'Request approvement from User',
    textTemplate: `Amount to approve <?>. Please approve or reject`,
    approver: 'hugo1',
  },
];

export async function up(sql: Sql) {
  for (const item of actiondefinitions) {
    await sql`
      INSERT INTO actiondefinitions
        (scenario_id, description, text_template, approver )
      VALUES
        (${item.scenarioId}, ${item.description},${item.textTemplate},${item.approver} )
  `;
  }
}

export async function down(sql: Sql) {
  for (const item of actiondefinitions) {
    await sql`
      DELETE FROM actiondefinitions WHERE action_id = ${item.actionId}
    `;
  }
}

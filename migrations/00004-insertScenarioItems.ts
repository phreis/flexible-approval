import { Sql } from 'postgres';

const basicApprovalItems = [
  {
    scenarioId: 1,
    stepId: 1,
    parentStepId: null,
    task: 'EVENT',
    condStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 2,
    parentStepId: 1,
    task: 'COND',
    condStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 3,
    parentStepId: 2,
    task: 'ACTION 1',
    condStepResult: true,
  },
  {
    scenarioId: 1,
    stepId: 4,
    parentStepId: 2,
    task: 'ACTION 2',
    condStepResult: false,
  },
  {
    scenarioId: 1,
    stepId: 5,
    parentStepId: 4,
    task: 'TER',
    condStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 6,
    parentStepId: 3,
    task: 'TER',
    condStepResult: null,
  },
];

const multiStepApprovalItems = [
  {
    scenarioId: 2,
    stepId: 1,
    parentStepId: null,
    task: 'EVENT',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 2,
    parentStepId: 1,
    task: 'COND',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 3,
    parentStepId: 2,
    task: 'ACTION',
    condStepResult: true,
  },
  {
    scenarioId: 2,
    stepId: 4,
    parentStepId: 2,
    task: 'EVENT',
    condStepResult: false,
  },
  {
    scenarioId: 2,
    stepId: 5,
    parentStepId: 4,
    task: 'TER',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 6,
    parentStepId: 3,
    task: 'ACTION',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 7,
    parentStepId: 6,
    task: 'EVENT',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 8,
    parentStepId: 7,
    task: 'AEVENT',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 9,
    parentStepId: 8,
    task: 'COND',
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 10,
    parentStepId: 9,
    task: 'EVENT1',
    condStepResult: true,
  },
  {
    scenarioId: 2,
    stepId: 11,
    parentStepId: 9,
    task: 'EVENT2',
    condStepResult: false,
  },
  {
    scenarioId: 2,
    stepId: 12,
    parentStepId: 10,
    task: 'TER',
    condStepResult: false,
  },
  {
    scenarioId: 2,
    stepId: 13,
    parentStepId: 11,
    task: 'TER',
    condStepResult: false,
  },
];

const scenarioitems = [...basicApprovalItems, ...multiStepApprovalItems];

export async function up(sql: Sql) {
  for (const item of scenarioitems) {
    await sql`
      INSERT INTO scenarioitems
        (scenario_id, step_id, parent_step_id, task, cond_step_result)
      VALUES
        (${item.scenarioId}, ${item.stepId},${item.parentStepId},${item.task},${item.condStepResult} )
  `;
  }
}

export async function down(sql: Sql) {
  for (const item of scenarioitems) {
    await sql`
      DELETE FROM scenarioitems WHERE scenario_id = ${item.scenarioId} AND step_id = ${item.stepId}
    `;
  }
}

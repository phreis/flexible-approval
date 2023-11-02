import { Sql } from 'postgres';

const basicApprovalItems = [
  {
    scenarioId: 1,
    stepId: 1,
    parentStepId: null,
    taskType: 'EVENT',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 2,
    parentStepId: 1,
    taskType: 'COND',
    taskId: 1,
    condStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 3,
    parentStepId: 2,
    taskType: 'ACTION 1',
    taskId: null,
    condStepResult: true,
  },
  {
    scenarioId: 1,
    stepId: 4,
    parentStepId: 2,
    taskType: 'ACTION 2',
    taskId: null,
    condStepResult: false,
  },
  {
    scenarioId: 1,
    stepId: 5,
    parentStepId: 4,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 6,
    parentStepId: 3,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
  },
];

const multiStepApprovalItems = [
  {
    scenarioId: 2,
    stepId: 1,
    parentStepId: null,
    taskType: 'EVENT',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 2,
    parentStepId: 1,
    taskType: 'COND',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 3,
    parentStepId: 2,
    taskType: 'ACTION',
    taskId: null,
    condStepResult: true,
  },
  {
    scenarioId: 2,
    stepId: 4,
    parentStepId: 2,
    taskType: 'EVENT',
    taskId: null,
    condStepResult: false,
  },
  {
    scenarioId: 2,
    stepId: 5,
    parentStepId: 4,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 6,
    parentStepId: 3,
    taskType: 'ACTION',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 7,
    parentStepId: 6,
    taskType: 'EVENT',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 8,
    parentStepId: 7,
    taskType: 'AEVENT',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 9,
    parentStepId: 8,
    taskType: 'COND',
    taskId: null,
    condStepResult: null,
  },
  {
    scenarioId: 2,
    stepId: 10,
    parentStepId: 9,
    taskType: 'EVENT1',
    taskId: null,
    condStepResult: true,
  },
  {
    scenarioId: 2,
    stepId: 11,
    parentStepId: 9,
    taskType: 'EVENT2',
    taskId: null,
    condStepResult: false,
  },
  {
    scenarioId: 2,
    stepId: 12,
    parentStepId: 10,
    taskType: 'TER',
    taskId: null,
    condStepResult: false,
  },
  {
    scenarioId: 2,
    stepId: 13,
    parentStepId: 11,
    taskType: 'TER',
    taskId: null,
    condStepResult: false,
  },
];

const scenarioitems = [...basicApprovalItems, ...multiStepApprovalItems];

export async function up(sql: Sql) {
  for (const item of scenarioitems) {
    await sql`
      INSERT INTO scenarioitems
        (scenario_id, step_id, parent_step_id, task_type, task_id, cond_step_result)
      VALUES
        (${item.scenarioId}, ${item.stepId},${item.parentStepId},${item.taskType},${item.taskId},${item.condStepResult} )
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

import { Sql } from 'postgres';

const basicApprovalItems = [
  {
    scenarioId: 1,
    stepId: 1,
    parentStepId: null,
    taskType: 'START',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 2,
    parentStepId: 1,
    taskType: 'COND',
    taskId: 1,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 3,
    parentStepId: 2,
    taskType: 'ACTION',
    taskId: 1,
    condStepResult: true,
    actionStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 4,
    parentStepId: 2,
    taskType: 'ACTION',
    taskId: 2,
    condStepResult: false,
    actionStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 5,
    parentStepId: 4,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 1,
    stepId: 6,
    parentStepId: 3,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
];

const basicApprovalItems2 = [
  {
    scenarioId: 3,
    stepId: 1,
    parentStepId: null,
    taskType: 'START',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 2,
    parentStepId: 1,
    taskType: 'COND',
    taskId: 1,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 3,
    parentStepId: 2,
    taskType: 'ACTION',
    taskId: 1,
    condStepResult: true,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 4,
    parentStepId: 2,
    taskType: 'EVENT',
    taskId: 2,
    condStepResult: false,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 5,
    parentStepId: 4,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 6,
    parentStepId: 3,
    taskType: 'EVENT',
    taskId: 10,
    condStepResult: null,
    actionStepResult: 'rejected',
  },
  {
    scenarioId: 3,
    stepId: 7,
    parentStepId: 3,
    taskType: 'EVENT',
    taskId: 11,
    condStepResult: null,
    actionStepResult: 'approved',
  },
  {
    scenarioId: 3,
    stepId: 8,
    parentStepId: 6,
    taskType: 'COND',
    taskId: 5,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 9,
    parentStepId: 7,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 10,
    parentStepId: 8,
    taskType: 'TER',
    taskId: null,
    condStepResult: false,
    actionStepResult: null,
  },
  {
    scenarioId: 3,
    stepId: 11,
    parentStepId: 8,
    taskType: 'TER',
    taskId: null,
    condStepResult: true,
    actionStepResult: null,
  },
];
const basicApprovalItems3 = [
  {
    scenarioId: 4,
    stepId: 1,
    parentStepId: null,
    taskType: 'START',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 4,
    stepId: 2,
    parentStepId: 1,
    taskType: 'ACTION',
    taskId: 1,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 4,
    stepId: 3,
    parentStepId: 2,
    taskType: 'ACTION',
    taskId: 1,
    condStepResult: null,
    actionStepResult: 'approved',
  },
  {
    scenarioId: 4,
    stepId: 4,
    parentStepId: 2,
    taskType: 'EVENT',
    taskId: 2,
    condStepResult: null,
    actionStepResult: 'rejected',
  },
  {
    scenarioId: 4,
    stepId: 5,
    parentStepId: 3,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
    actionStepResult: 'approved',
  },
  {
    scenarioId: 4,
    stepId: 6,
    parentStepId: 3,
    taskType: 'EVENT',
    taskId: null,
    condStepResult: null,
    actionStepResult: 'rejected',
  },
  {
    scenarioId: 4,
    stepId: 7,
    parentStepId: 6,
    taskType: 'TER',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
];
const basicApprovalItems4 = [
  {
    scenarioId: 5,
    stepId: 1,
    parentStepId: null,
    taskType: 'START',
    taskId: null,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 2,
    parentStepId: 1,
    taskType: 'COND',
    taskId: 2,
    condStepResult: null,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 3,
    parentStepId: 2,
    taskType: 'COND',
    taskId: 3,
    condStepResult: true,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 4,
    parentStepId: 2,
    taskType: 'COND',
    taskId: 4,
    condStepResult: false,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 5,
    parentStepId: 3,
    taskType: 'TER',
    taskId: null,
    condStepResult: true,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 6,
    parentStepId: 3,
    taskType: 'TER',
    taskId: null,
    condStepResult: false,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 7,
    parentStepId: 4,
    taskType: 'TER',
    taskId: null,
    condStepResult: true,
    actionStepResult: null,
  },
  {
    scenarioId: 5,
    stepId: 9,
    parentStepId: 4,
    taskType: 'TER',
    taskId: null,
    condStepResult: false,
    actionStepResult: null,
  },
];
const scenarioitems = [
  ...basicApprovalItems,
  ...basicApprovalItems2,
  ...basicApprovalItems3,
  ...basicApprovalItems4,
];

export async function up(sql: Sql) {
  for (const item of scenarioitems) {
    await sql`
      INSERT INTO
        scenarioitems (
          scenario_id,
          step_id,
          parent_step_id,
          task_type,
          task_id,
          cond_step_result,
          action_step_result
        )
      VALUES
        (
          ${item.scenarioId},
          ${item.stepId},
          ${item.parentStepId},
          ${item.taskType},
          ${item.taskId},
          ${item.condStepResult},
          ${item.actionStepResult}
        )
    `;
  }
}

export async function down(sql: Sql) {
  for (const item of scenarioitems) {
    await sql`
      DELETE FROM scenarioitems
      WHERE
        scenario_id = ${item.scenarioId}
        AND step_id = ${item.stepId}
    `;
  }
}

import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';

export type ScenarioItemType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId: number | null;
  condStepResult: boolean | null;
  actionStepResult: string | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE scenarioitems (
      scenario_id integer NOT NULL references scenarioheader (scenario_id) ON DELETE CASCADE,
      step_id integer NOT NULL,
      parent_step_id integer,
      task_type varchar(30) NOT NULL,
      task_id integer,
      cond_step_result boolean,
      action_step_result varchar(30),
      PRIMARY KEY(scenario_id, step_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE scenarioitems
  `;
}

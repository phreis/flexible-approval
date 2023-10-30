import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';

export type ScenarioItemType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['condStepResult'] | null;
  task: string;
  condStepResult: boolean | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE scenarioitems (
      scenario_id integer NOT NULL references scenarioheader (scenario_id) ON DELETE CASCADE,
      step_id integer NOT NULL,
      parent_step_id integer,
      task varchar(30) NOT NULL,
      cond_step_result boolean,
      PRIMARY KEY(scenario_id, step_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE scenarioitems
  `;
}
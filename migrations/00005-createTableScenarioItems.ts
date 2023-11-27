import { Sql } from 'postgres';
import { OrganizationType } from './00001-createTableOrganizations';
import { ScenarioHeaderType } from './00003-createTableScenarioHeader';

export type ScenarioItemType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: number;
  parentStepId: ScenarioItemType['stepId'] | null;
  taskType: string;
  taskId: number | null;
  condStepResult: boolean | null;
  actionStepResult: string | null;
  orgId: OrganizationType['orgId'];
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      scenarioitems (
        org_id INTEGER NOT NULL,
        scenario_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
        parent_step_id INTEGER,
        task_type VARCHAR(30) NOT NULL,
        task_id INTEGER,
        cond_step_result BOOLEAN,
        action_step_result VARCHAR(30),
        PRIMARY KEY (
          org_id,
          scenario_id,
          step_id
        )
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE scenarioitems `;
}

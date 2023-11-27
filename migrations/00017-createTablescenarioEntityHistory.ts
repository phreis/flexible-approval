import { Sql } from 'postgres';
import { OrganizationType } from './00001-createTableOrganizations';
import { ScenarioHeaderType } from './00003-createTableScenarioHeader';
import { ScenarioItemType } from './00005-createTableScenarioItems';
import { User } from './00007-createTableUsers';
import { ScenarioEntityType } from './00016-createTablescenarioEntities';

export type ScenarioEntityHistoryType = {
  historyId: string;
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
  orgId: OrganizationType['orgId'];
  stepId: ScenarioItemType['stepId'];
  taskType: ScenarioItemType['taskType'];
  taskId: ScenarioItemType['taskId'] | null;
  condResult: ScenarioItemType['condStepResult'] | null;
  actionResult: ScenarioItemType['actionStepResult'] | null;
  state: 'DONE' | 'ERROR' | 'PENDING' | 'CONTINUE' | string | null;
  message: string | null;
  username: User['username'];
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      scenarioentityhistory (
        history_id VARCHAR(36) NOT NULL,
        scenario_entity_id VARCHAR(36) NOT NULL REFERENCES scenarioentities (
          scenario_entity_id
        ) ON DELETE CASCADE,
        org_id INTEGER NOT NULL,
        scenario_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        task_type VARCHAR(30) NOT NULL,
        task_id INTEGER,
        cond_result BOOLEAN,
        action_result VARCHAR(30),
        state VARCHAR(20),
        message VARCHAR(1000),
        username VARCHAR(80) NOT NULL,
        creationdate TIMESTAMP NOT NULL DEFAULT NOW (),
        PRIMARY KEY (
          history_id
        )
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE scenarioentityhistory `;
}

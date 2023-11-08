import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';
import { ScenarioItemType } from './00003-createTableScenarioItems';
import { User } from './00005-createTableUsers';
import { ScenarioEntityType } from './00015-createTablescenarioEntities';

export type ScenarioEntityHistoryType = {
  historyId: string;
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
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
        scenario_id INTEGER NOT NULL REFERENCES scenarioheader (
          scenario_id
        ) ON DELETE CASCADE,
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

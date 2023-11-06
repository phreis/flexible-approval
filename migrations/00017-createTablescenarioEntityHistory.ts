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
  state: 'DONE' | 'ERROR' | 'PENDING' | 'CONTINUE' | null;
  message: string | null;
  username: User['username'];
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE scenarioentityhistory (
      scenario_entity_history_id varchar(36) NOT NULL,
      scenario_entity_id varchar(36) NOT NULL references scenarioentities (scenario_entity_id) ON DELETE CASCADE,
      scenario_id integer NOT NULL references scenarioheader (scenario_id) ON DELETE CASCADE,
      step_id integer NOT NULL,
      task_type varchar(30) NOT NULL,
      task_id integer,
      cond_result boolean,
      action_result varchar(30),
      state varchar(20),
      message varchar(1000),
      username varchar(80) NOT NULL,
      creationdate timestamp NOT NULL DEFAULT NOW(),
      PRIMARY KEY(scenario_entity_history_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE scenarioentityhistory
  `;
}

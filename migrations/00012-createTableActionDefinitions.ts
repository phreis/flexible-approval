import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00003-createTableScenarioHeader';
import { ScenarioItemType } from './00005-createTableScenarioItems';
import { User } from './00007-createTableUsers';

export type ActionDefinitionType = {
  actionId: ScenarioItemType['taskId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: string;
  textTemplate: string;
  approver: User['username'];
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      actiondefinitions (
        action_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        scenario_id INTEGER NOT NULL,
        description VARCHAR(100) NOT NULL,
        text_template VARCHAR(1000) NOT NULL,
        approver VARCHAR(80) NOT NULL REFERENCES users (
          username
        ),
        creationdate TIMESTAMP NOT NULL DEFAULT NOW ()
      );
  `;
}
export async function down(sql: Sql) {
  await sql` DROP TABLE actiondefinitions `;
}

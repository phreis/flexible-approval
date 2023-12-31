import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00003-createTableScenarioHeader';

export type ConditionHeaderType = {
  conditionId: number;
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: string;
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      conditionheader (
        condition_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        scenario_id INTEGER NOT NULL,
        description VARCHAR(100) NOT NULL,
        creationdate TIMESTAMP NOT NULL DEFAULT NOW ()
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE conditionheader `;
}

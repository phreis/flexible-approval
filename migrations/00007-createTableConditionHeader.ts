import { Sql } from 'postgres';
import { ScenarioHeaderType } from '../migrations/00001-createTableScenarioHeader';

export type ConditionHeaderType = {
  conditionId: number;
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: string;
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE conditionheader (
      condition_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      scenario_id integer NOT NULL,
      description varchar(100) NOT NULL,
      creationdate timestamp NOT NULL DEFAULT NOW()
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE conditionheader
  `;
}

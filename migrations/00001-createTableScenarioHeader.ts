import { Sql } from 'postgres';

export type ScenarioHeaderType = {
  scenarioId: number;
  description: string;
  contextDataDescription: string | null;
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE scenarioheader (
      scenario_id integer NOT NULL,
      description varchar(100) NOT NULL,
      context_data_description varchar(1000),
      creationdate timestamp NOT NULL DEFAULT NOW(),
      PRIMARY KEY(scenario_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE scenarioheader
  `;
}

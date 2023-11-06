import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';
import { ScenarioItemType } from './00003-createTableScenarioItems';

export type ScenarioEntityType = {
  scenarioEntityId: string;
  scenarioId: ScenarioHeaderType['scenarioId'];
  context: string | null;
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE scenarioentities (
      scenario_entity_id varchar(36) NOT NULL,
      scenario_id integer NOT NULL references scenarioheader (scenario_id) ON DELETE CASCADE,
      context varchar(1000),
      creationdate timestamp NOT NULL DEFAULT NOW(),
      PRIMARY KEY(scenario_entity_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE scenarioentities
  `;
}

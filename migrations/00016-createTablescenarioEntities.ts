import { Sql } from 'postgres';
import { OrganizationType } from './00000-createTableOrganizations';
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
    CREATE TABLE
      scenarioentities (
        scenario_entity_id VARCHAR(36) NOT NULL,
        org_id INTEGER NOT NULL,
        scenario_id INTEGER NOT NULL,
        context VARCHAR(1000),
        creationdate TIMESTAMP NOT NULL DEFAULT NOW (),
        PRIMARY KEY (
          scenario_entity_id
        )
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE scenarioentities `;
}

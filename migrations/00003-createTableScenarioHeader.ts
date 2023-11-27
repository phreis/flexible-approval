import { Sql } from 'postgres';
import { OrganizationType } from './00001-createTableOrganizations';

export type ScenarioHeaderType = {
  scenarioId: number;
  description: string;
  contextDataDescription: string | null;
  creationdate: Date;
  orgId: OrganizationType['orgId'];
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      scenarioheader (
        org_id INTEGER NOT NULL,
        scenario_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
        description VARCHAR(100) NOT NULL,
        context_data_description VARCHAR(1000),
        creationdate TIMESTAMP NOT NULL DEFAULT NOW (),
        PRIMARY KEY (
          org_id,
          scenario_id
        )
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE scenarioheader `;
}

import { Sql } from 'postgres';
import { ActionDefinitionType } from './00011-createTableActionDefinitions';
import { ScenarioEntityType } from './00015-createTablescenarioEntities';

export type ActionEntityType = {
  actionEntityId: string;
  actionId: ActionDefinitionType['actionId'];
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
  response: string | null;
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE actionentities (
      action_entity_id varchar(36) NOT NULL,
      action_id integer NOT NULL,
      scenario_entity_id varchar(36)NOT NULL,
      response varchar(30),
      creationdate timestamp NOT NULL DEFAULT NOW(),
      PRIMARY KEY(action_entity_id)
    );
  `;
}
export async function down(sql: Sql) {
  await sql`
    DROP TABLE actionentities
  `;
}

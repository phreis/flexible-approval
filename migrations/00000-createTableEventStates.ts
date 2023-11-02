import { Sql } from 'postgres';
import { ScenarioHeaderType } from './00001-createTableScenarioHeader';
import { ScenarioItemType } from './00003-createTableScenarioItems';

export type EventStateType = {
  scenarioEntityId: string;
  scenarioId: ScenarioHeaderType['scenarioId'];
  stepId: ScenarioItemType['stepId'];
  eventName: string;
  state: 'NEW' | 'AWAITING' | 'FINISHED' | 'ERROR' | string;
  context: string | null;
  creationdate: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE eventstates (
      scenario_entity_id varchar(36) NOT NULL,
      scenario_id integer NOT NULL,
      step_id integer NOT NULL,
      event_name varchar(30) NOT NULL,
      state varchar(30) NOT NULL,
      context varchar(1000),
      creationdate timestamp NOT NULL DEFAULT NOW(),
      PRIMARY KEY(scenario_entity_id,scenario_id,step_id)
    );
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE eventstates
  `;
}

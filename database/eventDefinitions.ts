import { cache } from 'react';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
import { ActionDefinitionType } from '../migrations/00012-createTableActionDefinitions';
import { EventDefinitionType } from '../migrations/00019-createTableEventDefinitions';
import { sql } from './connect';

export const getEventDefinitionById = cache(
  async (eventId: EventDefinitionType['eventId']) => {
    const [eventDefinition] = await sql<EventDefinitionType[]>`
      SELECT
        *
      FROM
        eventdefinitions
      WHERE
        event_id = ${eventId}
    `;

    return eventDefinition;
  },
);

export type CreateEventDefinitionType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: EventDefinitionType['description'];
  textTemplate: EventDefinitionType['textTemplate'];
  recipient: EventDefinitionType['recipient'];
};

export const createEventDefinition = cache(
  async (event: CreateEventDefinitionType) => {
    const { scenarioId, description, textTemplate, recipient } = event;
    const [actionItem] = await sql<EventDefinitionType[]>`
      INSERT INTO
        eventdefinitions (
          scenario_id,
          description,
          text_template,
          recipient
        )
      VALUES
        (
          ${scenarioId},
          ${description},
          ${textTemplate},
          ${recipient}
        ) RETURNING *
    `;
    return actionItem;
  },
);

import { cache } from 'react';
import { EventStateType } from '../migrations/00000-createTableEventStates';
import { sql } from './connect';
import { ScenarioType } from './scenarios';

type CreateEventStateType = {
  scenarioId: EventStateType['scenarioId'];
  stepId: EventStateType['stepId'];
  eventName: EventStateType['eventName'];
  state: EventStateType['state'];
  context: EventStateType['context'] | undefined;
};

export const createEventState = cache(
  async (createEventState: CreateEventStateType) => {
    const { scenarioId, stepId, eventName, state, context } = createEventState;
    const [eventState] = await sql<EventStateType[]>`
      INSERT INTO eventstates
        (scenario_entity_id, scenario_id, step_id, event_name, state, context)
      VALUES
        (${crypto.randomUUID()}, ${scenarioId}, ${stepId},${eventName}, ${state},${
      context || null
    })
      RETURNING *
    `;

    return eventState;
  },
);

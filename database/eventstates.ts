import { cache } from 'react';
import { EventStateType } from '../migrations/00000-createTableEventStates';
import { sql } from './connect';

type CreateEventStateType = {
  scenarioId: EventStateType['scenarioId'];
  stepId: EventStateType['stepId'];
  eventName: EventStateType['eventName'];
  state: EventStateType['state'];
  context: EventStateType['context'] | undefined;
};

export const createEventState = cache(
  async (createEventStateParam: CreateEventStateType) => {
    const { scenarioId, stepId, eventName, state, context } =
      createEventStateParam;
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

export const getEventStateByKey = cache(
  async (
    scenarioEntityId: EventStateType['scenarioEntityId'],
    scenarioId: EventStateType['scenarioId'],
    stepId: EventStateType['stepId'],
  ) => {
    const [eventState] = await sql<EventStateType[]>`
  SELECT * FROM eventstates
     WHERE scenario_entity_id = ${scenarioEntityId} AND
     scenario_id = ${scenarioId} AND
      step_id = ${stepId}`;

    return eventState;
  },
);

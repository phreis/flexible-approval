import { cache } from 'react';
import { ActionDefinitionType } from '../migrations/00012-createTableActionDefinitions';
import { sql } from './connect';

export const getActionDefinitionById = cache(
  async (actionId: ActionDefinitionType['actionId']) => {
    const [actionDefinition] = await sql<ActionDefinitionType[]>`
      SELECT
        *
      FROM
        actiondefinitions
      WHERE
        action_id = ${actionId}
    `;

    return actionDefinition;
  },
);

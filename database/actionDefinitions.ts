import { cache } from 'react';
import { ScenarioHeaderType } from '../migrations/00003-createTableScenarioHeader';
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

export type CreateActionDefinitionType = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  description: ActionDefinitionType['description'];
  textTemplate: ActionDefinitionType['textTemplate'];
  approver: ActionDefinitionType['approver'];
};

export const createActionDefinition = cache(
  async (action: CreateActionDefinitionType) => {
    const { scenarioId, description, textTemplate, approver } = action;
    const [actionItem] = await sql<ActionDefinitionType[]>`
      INSERT INTO
        actiondefinitions (
          scenario_id,
          description,
          text_template,
          approver
        )
      VALUES
        (
          ${scenarioId},
          ${description},
          ${textTemplate},
          ${approver}
        ) RETURNING *
    `;
    return actionItem;
  },
);

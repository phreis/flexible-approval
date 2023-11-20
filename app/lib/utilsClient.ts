import { ScenarioHeaderType } from '../../migrations/00003-createTableScenarioHeader';

export function getContextAttributeNames(
  contextDefinition: ScenarioHeaderType['contextDataDescription'],
) {
  try {
    return Object.keys(JSON.parse(contextDefinition));
  } catch (e) {
    throw `Please provide the context description as the representation of an JavaScript Object E.g.: {"attributeName": "string"}`;
  }
}

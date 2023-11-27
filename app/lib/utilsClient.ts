import { ScenarioHeaderType } from '../../migrations/00003-createTableScenarioHeader';

export function getContextAttributeNames(
  contextDefinition: ScenarioHeaderType['contextDataDescription'],
) {
  if (contextDefinition) {
    try {
      return Object.keys(JSON.parse(contextDefinition));
    } catch (e) {
      throw Error(
        `Please provide the context description as the representation of an JavaScript Object E.g.: {"attributeName": "string"}`,
      );
    }
  } else {
    throw Error(
      `Please provide the context description as the representation of an JavaScript Object E.g.: {"attributeName": "string"}`,
    );
  }
}

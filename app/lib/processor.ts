import { getConditionItems } from '../../database/conditions';
import { createEventState } from '../../database/eventstates';
import {
  getScenarioHeaderById,
  getScenarioItems,
} from '../../database/scenarios';
import { EventStateType } from '../../migrations/00000-createTableEventStates';
import { ScenarioHeaderType } from '../../migrations/00001-createTableScenarioHeader';
import { ScenarioItemType } from '../../migrations/00003-createTableScenarioItems';
import { ConditionHeaderType } from '../../migrations/00007-createTableConditionHeader';
import ScenarioTree from '../ScenarioTree';

export async function processScenario(
  sceanarioId: ScenarioHeaderType['scenarioId'],
  context: EventStateType['context'],
) {
  // Check, if result.data.scenarioId exists
  const scenarioHeader = await getScenarioHeaderById(sceanarioId);
  if (!scenarioHeader[0]) {
    // TODO: Throw some error
    throw new Error(`Scenario ${sceanarioId} not found`);
  }

  // Save event state to DB:
  const eventEntry = await createEventState({
    scenarioId: sceanarioId,
    stepId: 1,
    eventName: 'start scenario',
    state: 'FINISHED',
    context: context,
  });

  if (!eventEntry) {
    // TODO: Throw some error
    throw new Error(`Error creating the new eventEntry`);
  }

  // Get all sceanrio steps
  const scenarioItems = await getScenarioItems(sceanarioId);
  if (!scenarioItems) {
    // TODO: Throw some error
    throw new Error(`No Items for Scenario ${sceanarioId} found`);
  }

  // Build up tree structure from DB entries
  const tree = new ScenarioTree(scenarioHeader[0], eventEntry);
  scenarioItems.forEach((item: ScenarioItemType) =>
    tree.insertNode({ ...item, children: null }),
  );
  tree.process();
}

export async function processCondition(
  conditionId: ConditionHeaderType['conditionId'],
  context: EventStateType['context'],
): Promise<boolean> {
  let returnValue: boolean = false;

  const conditionItems = await getConditionItems(conditionId);
  // console.log(conditionItems);
  const contextObj = JSON.parse(context);
  console.log(contextObj);
  console.log(contextObj[conditionItems[0].contextAttributeName]);
  conditionItems.forEach((item) => {
    const compVariable = contextObj[item.contextAttributeName];
    if (compVariable) {
      switch (item.comperator) {
        case '<':
          returnValue = compVariable < item.compConstant;
          break;
        case '>':
          returnValue = compVariable > item.compConstant;
          break;
        default:
          // TODO: Throw some error
          throw new Error(
            `Error: Compaator ${item.comperator} not (yet) implemented`,
          );
      }
    } else {
      // TODO: Throw some error
      throw new Error(
        `Error: Attr ${item.contextAttributeName} not found in context-data`,
      );
    }
  });
  return returnValue;
}

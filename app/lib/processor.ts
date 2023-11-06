import { getActionDefinitionById } from '../../database/actionDefinitions';
import { getConditionItems } from '../../database/conditions';
import {
  createScenarioEntityHistory,
  CreateScenarioEntityHistoryType,
  getScenarioEntityHistoryLatest,
} from '../../database/scenarioEntityHistory';
import { getScenarioItems } from '../../database/scenarios';
import { ScenarioItemType } from '../../migrations/00003-createTableScenarioItems';
import { ScenarioEntityType } from '../../migrations/00015-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../../migrations/00017-createTablescenarioEntityHistory';
import ScenarioTree, { WfNode } from '../ScenarioTree';

export async function processScenarioEntity(
  scenarioEntity: ScenarioEntityType,
) {
  // Get all sceanrio steps
  const scenarioItems = await getScenarioItems(scenarioEntity.scenarioId);
  if (!scenarioItems) {
    // TODO: Throw some error
    throw new Error(`No Items for Scenario ${scenarioEntity.scenarioId} found`);
  }

  // Build up tree structure from DB entries
  const tree = new ScenarioTree(scenarioEntity);
  scenarioItems.forEach((item: ScenarioItemType) =>
    tree.insertNode({ ...item, children: null }),
  );
  tree.process();
}

export async function processCondition(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
): Promise<boolean> {
  let returnValue: boolean = false;
  let state,
    errorMessage = '';

  const conditionItems = await getConditionItems(node.taskId || 0);
  // console.log(conditionItems);
  const contextObj = JSON.parse(scenarioEntity.context || '');
  conditionItems.forEach(
    (item) => {
      try {
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
                `Error: Operator ${item.comperator} not (yet) implemented`,
              );
          }
        } else {
          // TODO: Throw some error
          throw new TypeError(
            `Error: Attr ${item.contextAttributeName} not found in context-data`,
          );
        }
      } catch (err: any) {
        state = 'ERROR';
        errorMessage = err.message;
      }
    },
    // TODO: implement, multiple condition steps ()
  );

  // Log history
  const historyEntry: CreateScenarioEntityHistoryType = {
    scenarioEntityId: scenarioEntity.scenarioEntityId,
    scenarioId: scenarioEntity.scenarioId,
    stepId: node.stepId,
    taskType: node.taskType,
    taskId: node.taskId,
    condResult: returnValue,
    actionResult: null,
    state: state || 'DONE',
    message: errorMessage,
  };
  await createScenarioEntityHistory(historyEntry);

  console.log(
    `${scenarioEntity.scenarioEntityId} processCondition result: ${returnValue}`,
  );
  return returnValue;
}

export async function processAction(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
  lastHistory: ScenarioEntityHistoryType | undefined,
): Promise<string | null> {
  // TODO:
  if (lastHistory?.state === 'CONTINUE') {
    // CONTINUE and actionResult has been set by user-interaction
    // give back actionResult to processing chain
    // the Action is DONE at this stage
    // Log history
    const historyEntry: CreateScenarioEntityHistoryType = {
      scenarioEntityId: scenarioEntity.scenarioEntityId,
      scenarioId: scenarioEntity.scenarioId,
      stepId: node.stepId,
      taskType: node.taskType,
      taskId: node.taskId,
      condResult: null,
      actionResult: null,
      state: 'DONE',
      message: null,
    };
    await createScenarioEntityHistory(historyEntry);
    return await lastHistory.actionResult;
  } else {
    const actionDefinition = await getActionDefinitionById(node.taskId);

    // TODO: notify
    console.log(
      `Email to: ${actionDefinition?.actionId} \n Text: ${actionDefinition?.textTemplate} Please use the following link: \n http://localhost:3000/../${scenarioEntity.scenarioEntityId}`,
    );

    // TODO: in case of error, log ERROR

    // Log history
    const historyEntry: CreateScenarioEntityHistoryType = {
      scenarioEntityId: scenarioEntity.scenarioEntityId,
      scenarioId: scenarioEntity.scenarioId,
      stepId: node.stepId,
      taskType: node.taskType,
      taskId: node.taskId,
      condResult: null,
      actionResult: null,
      state: 'PENDING',
      message: null,
    };
    await createScenarioEntityHistory(historyEntry);
    return await null;
  }
}
export async function processStart(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
) {
  // Log history
  const historyEntry: CreateScenarioEntityHistoryType = {
    scenarioEntityId: scenarioEntity.scenarioEntityId,
    scenarioId: scenarioEntity.scenarioId,
    stepId: node.stepId,
    taskType: node.taskType,
    taskId: node.taskId,
    condResult: null,
    actionResult: null,
    state: 'DONE',
    message: null,
  };
  await createScenarioEntityHistory(historyEntry);
}
export async function processEvent(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
) {
  // TODO:fire Event

  // Log history
  const historyEntry: CreateScenarioEntityHistoryType = {
    scenarioEntityId: scenarioEntity.scenarioEntityId,
    scenarioId: scenarioEntity.scenarioId,
    stepId: node.stepId,
    taskType: node.taskType,
    taskId: node.taskId,
    condResult: null,
    actionResult: null,
    state: 'DONE',
    message: null,
  };
  await createScenarioEntityHistory(historyEntry);
}
export async function processTer(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
) {
  // Log history
  const historyEntry: CreateScenarioEntityHistoryType = {
    scenarioEntityId: scenarioEntity.scenarioEntityId,
    scenarioId: scenarioEntity.scenarioId,
    stepId: node.stepId,
    taskType: node.taskType,
    taskId: node.taskId,
    condResult: null,
    actionResult: null,
    state: 'DONE',
    message: null,
  };
  await createScenarioEntityHistory(historyEntry);
}

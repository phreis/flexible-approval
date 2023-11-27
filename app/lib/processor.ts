import { getActionDefinitionById } from '../../database/actionDefinitions';
import { getConditionItems } from '../../database/conditions';
import { getEventDefinitionById } from '../../database/eventDefinitions';
import { getScenarioEntityById } from '../../database/scenarioEntities';
import {
  createScenarioEntityHistory,
  CreateScenarioEntityHistoryType,
  getScenarioEntityHistoryByHistoryId,
  getScenarioEntityHistoryLatest,
} from '../../database/scenarioEntityHistory';
import { getScenarioItems } from '../../database/scenarios';
import { ScenarioItemType } from '../../migrations/00005-createTableScenarioItems';
import { ScenarioEntityType } from '../../migrations/00016-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../../migrations/00017-createTablescenarioEntityHistory';
import ScenarioTree, { WfNode } from '../ScenarioTree';
import { sendEmailAction, sendEmailEvent } from './email';

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
  await tree.process();
}

export async function processCondition(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
  lastHistory: ScenarioEntityHistoryType | undefined,
): Promise<boolean> {
  let returnValue: boolean = false;
  let state = 'DONE',
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
              throw new Error(
                `Error: Operator ${item.comperator} not (yet) implemented`,
              );
          }
        } else {
          throw new Error(
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
  if (lastHistory?.state !== 'DONE') {
    await createScenarioEntityHistory(historyEntry);
  }

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
    // no additonal history entry at this stage!
    return await lastHistory.actionResult;
  } else {
    const actionDefinition = await getActionDefinitionById(node.taskId);

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
    const pendingHistoryEntry = await createScenarioEntityHistory(historyEntry);

    if (actionDefinition && pendingHistoryEntry && pendingHistoryEntry[0]) {
      await sendEmailAction(
        actionDefinition.approver,
        actionDefinition.textTemplate,
        pendingHistoryEntry[0]?.historyId,
      );
    }

    /*    console.log(
      `Email to: ${actionDefinition?.approver} \nText: ${actionDefinition?.textTemplate} Please use the following link: \n http://localhost:3000/action/${pendingHistoryEntry[0]?.historyId}`,
    ); */

    // TODO: in case of error, log ERROR

    return await null;
  }
}
export async function processStart(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
  lastHistory: ScenarioEntityHistoryType | undefined,
) {
  if (lastHistory?.state === 'DONE') return;

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
  lastHistory: ScenarioEntityHistoryType | undefined,
) {
  if (lastHistory?.state === 'DONE') return;

  const eventDefinition = await getEventDefinitionById(node.taskId);

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

  // get the recipient email address from context
  try {
    const contextObj = JSON.parse(scenarioEntity.context || '');
    if (contextObj && eventDefinition?.recipient) {
      const mailTo = contextObj[eventDefinition.recipient];
      await sendEmailEvent(mailTo, eventDefinition.textTemplate);
    }
  } catch (e) {
    // TODO: react on err
  }
}
export async function processTer(
  node: WfNode,
  scenarioEntity: ScenarioEntityType,
  lastHistory: ScenarioEntityHistoryType | undefined,
) {
  if (lastHistory?.state === 'DONE') return;

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

/** Called, when a Approver responds to the Action (approve or reject)
 * Called from Form Action: processActionResultAction (actions.ts)
 */
export async function processActionResult(
  historyId: ScenarioEntityHistoryType['historyId'],
  actionResult: ScenarioEntityHistoryType['actionResult'],
) {
  const scenarioEntityHistoryArr =
    await getScenarioEntityHistoryByHistoryId(historyId);
  if (scenarioEntityHistoryArr && scenarioEntityHistoryArr[0]) {
    const scenarioEntityHistory = scenarioEntityHistoryArr[0];

    // Check, with getScenarioEntityHistoryLatest(scenarioEntityId) if the history set to be processed, is (still) the latest(?)
    const scenarioEntityHistoryLatestArr = await getScenarioEntityHistoryLatest(
      scenarioEntityHistory.scenarioId,
      scenarioEntityHistory.scenarioEntityId,
      scenarioEntityHistory.stepId,
    );
    if (scenarioEntityHistoryLatestArr && scenarioEntityHistoryLatestArr[0]) {
      const scenarioEntityHistoryLatest = scenarioEntityHistoryLatestArr[0];
      // Check if history entry is processable E.g. state is PENDING && actionResult is empty
      if (
        !(
          scenarioEntityHistory.state === 'PENDING' &&
          !scenarioEntityHistory.actionResult
        ) ||
        scenarioEntityHistoryLatest.historyId !==
          scenarioEntityHistory.historyId
      ) {
        throw new Error(
          `History entry ${historyId} cannot processed (anymore)`,
        );
      }
      // TODO:Check Authorization - user -> throw error

      // create new history entry
      const historyEntry: CreateScenarioEntityHistoryType = {
        ...scenarioEntityHistory,
        state: 'CONTINUE',
        actionResult: actionResult,
      };
      await createScenarioEntityHistory(historyEntry);

      // Continue with processing
      const scenarioEntity = await getScenarioEntityById(
        scenarioEntityHistory.scenarioEntityId,
      );
      if (scenarioEntity && scenarioEntity[0]) {
        await processScenarioEntity(scenarioEntity[0]);
      }
    }
  } else {
    throw new Error(`History entry ${historyId} does not exist`);
  }
}

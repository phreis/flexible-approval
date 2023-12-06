import { getScenarioEntityById } from '../../database/scenarioEntities';
import {
  createScenarioEntityHistory,
  CreateScenarioEntityHistoryType,
  getScenarioEntityHistoryByHistoryId,
  getScenarioEntityHistoryLatest,
} from '../../database/scenarioEntityHistory';
import { getScenarioItems } from '../../database/scenarios';
import { ScenarioEntityType } from '../../migrations/00016-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../../migrations/00017-createTablescenarioEntityHistory';
import ScenarioTree from '../ScenarioTree';

export async function processScenarioEntity(
  scenarioEntity: ScenarioEntityType,
) {
  // Get all sceanrio steps
  const scenarioItems = await getScenarioItems(scenarioEntity.scenarioId);
  if (!scenarioItems) {
    // TODO: Throw some error
    throw new Error(`No Items for Scenario ${scenarioEntity.scenarioId} found`);
  }
  const tree = new ScenarioTree(scenarioEntity.scenarioId, scenarioEntity);
  await tree.getNodes();
  await tree.process();
}

/** Called, when a Approver responds to the Action (approve or reject)
 * Called from Form Action: processActionResultAction (actions.ts)
 */
export async function processActionResult(
  historyId: ScenarioEntityHistoryType['historyId'],
  actionResult: ScenarioEntityHistoryType['preStepComparativeValue'],
) {
  const scenarioEntityHistory =
    await getScenarioEntityHistoryByHistoryId(historyId);
  if (scenarioEntityHistory) {
    // Check, with getScenarioEntityHistoryLatest(scenarioEntityId) if the history set to be processed, is (still) the latest(?)
    const scenarioEntityHistoryLatest = await getScenarioEntityHistoryLatest(
      scenarioEntityHistory.scenarioId,
      scenarioEntityHistory.scenarioEntityId,
      scenarioEntityHistory.stepId,
    );
    if (scenarioEntityHistoryLatest) {
      // Check if history entry is processable E.g. state is PENDING && actionResult is empty
      if (
        !(
          scenarioEntityHistory.state === 'PENDING' &&
          !scenarioEntityHistory.preStepComparativeValue
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
        preStepComparativeValue: actionResult,
      };
      await createScenarioEntityHistory(historyEntry);

      // Continue with processing
      const scenarioEntity = await getScenarioEntityById(
        scenarioEntityHistory.scenarioEntityId,
      );
      if (scenarioEntity) {
        await processScenarioEntity(scenarioEntity);
      }
    }
  } else {
    throw new Error(`History entry ${historyId} does not exist`);
  }
}

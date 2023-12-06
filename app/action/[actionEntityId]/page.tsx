import { Metadata } from 'next';
import React from 'react';
import { getActionDefinitionById } from '../../../database/actionDefinitions';
import { getScenarioEntityById } from '../../../database/scenarioEntities';
import {
  getScenarioEntityHistoryByHistoryId,
  getScenarioEntityHistoryLatest,
} from '../../../database/scenarioEntityHistory';
import ActionForm from './ActionForm';

export const metadata: Metadata = {
  title: 'Please respond',
  description: 'Approval Workflows made easy',
};

type Props = {
  params: { actionEntityId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ActionEntiyPage(props: Props) {
  const scenarioEntityHistory = await getScenarioEntityHistoryByHistoryId(
    props.params.actionEntityId,
  );

  if (!scenarioEntityHistory) {
    return <main>{`${props.params.actionEntityId} does not exitst`}</main>;
  } else {
    if (
      scenarioEntityHistory.taskId &&
      scenarioEntityHistory.scenarioEntityId
    ) {
      const actionDefinition = await getActionDefinitionById(
        scenarioEntityHistory.taskId,
      );

      const scenarioEntity = await getScenarioEntityById(
        scenarioEntityHistory.scenarioEntityId,
      );

      if (!actionDefinition) {
        return (
          <main>
            Err: Action definition for taskId {scenarioEntityHistory.taskId} not
            found
          </main>
        );
      }

      if (scenarioEntity) {
        const scenarioEntityHistoryLatest =
          await getScenarioEntityHistoryLatest(
            scenarioEntityHistory.scenarioId,
            scenarioEntityHistory.scenarioEntityId,
            scenarioEntityHistory.stepId,
          );

        // Check if history entry is processable E.g. state is PENDING && actionResult is empty
        if (
          !(
            scenarioEntityHistory.state === 'PENDING' &&
            !scenarioEntityHistory.preStepComparativeValue
          ) ||
          scenarioEntityHistoryLatest?.historyId !==
            scenarioEntityHistory.historyId
        ) {
          return (
            <main>
              History entry {props.params.actionEntityId} cannot processed
              (anymore)
            </main>
          );
        }

        return (
          <main>
            <ActionForm
              scenarioEntityHistory={scenarioEntityHistory}
              actionDefinition={actionDefinition}
              scenarioEntity={scenarioEntity}
            />
          </main>
        );
      }
    }
  }
}

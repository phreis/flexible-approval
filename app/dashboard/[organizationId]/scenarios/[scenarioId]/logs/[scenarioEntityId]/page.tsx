import { notFound } from 'next/navigation';
import React from 'react';
import { getScenarioHeaderById } from '../../../../../../../database/scenarios';
import { TabType } from '../../../../PageHeaderTabs';
import DashboardPage from '../../../DashboardPage';
import { ScenarioDiagram } from '../../../ScenarioDiagram';
import ScenarioEntitiesHistoryList from './ScenarioEntitiesHistoryList';
import styles from './ScenarioEntitiesHistoryPage.module.scss';

type Props = {
  params: {
    scenarioId: string;
    scenarioEntityId: string;
    organizationId: number;
  };
  searchParams: { [key: string]: string | undefined };
};

export default async function ScenarioEntityHistoryPage({
  params,
  searchParams,
}: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: 'Diagram',
      tabId: 't1',
      href: `/dashboard/${params.organizationId}/scenarios/${Number(
        params.scenarioId,
      )}`,
    },
    {
      tabTitle: 'History',
      tabId: 't2',
      href: `/dashboard/${params.organizationId}/scenarios/${Number(
        params.scenarioId,
      )}/logs`,
    },
    {
      tabTitle: 'Incomplete Executions',
      tabId: 't3',
      href: `/dashboard/${params.organizationId}/scenarios/${Number(
        params.scenarioId,
      )}/logs?filter=incomplete`,
    },
  ];

  const scenarioHeaderData = await getScenarioHeaderById(
    Number(params.scenarioId),
  );

  const scenarioId = scenarioHeaderData[0]?.scenarioId;

  return (
    <DashboardPage
      heading={scenarioHeaderData[0]?.description || 'No descrition'}
      tabs={tabs}
      activeTab="t2"
    >
      <div className={styles.basicGridDivider}>
        <ScenarioDiagram
          scenarioId={Number(params.scenarioId)}
          scenarioEntityId={params.scenarioEntityId}
        />
        <ScenarioEntitiesHistoryList
          scenarioEntityId={params.scenarioEntityId}
        />
      </div>
    </DashboardPage>
  );
}

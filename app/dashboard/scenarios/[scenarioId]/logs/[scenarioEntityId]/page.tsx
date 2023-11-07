import { notFound } from 'next/navigation';
import React from 'react';
import { getScenarioHeaderById } from '../../../../../../database/scenarios';
import { TabType } from '../../../../PageHeaderTabs';
import DashboardPage from '../../../DashboardPage';
import ScenarioEntitiesHistoryList from './ScenarioEntitiesHistoryList';

type Props = {
  params: { scenarioId: string; scenarioEntityId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ScenarioEntityPage({
  params,
  searchParams,
}: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: 'Diagram',
      tabId: 't1',
      href: `/dashboard/scenarios/${Number(params.scenarioId)}`,
    },
    {
      tabTitle: 'History',
      tabId: 't2',
      href: `/dashboard/scenarios/${Number(params.scenarioId)}/logs`,
    },
    {
      tabTitle: 'Incomplete Executions',
      tabId: 't3',
      href: `/dashboard/scenarios/${Number(
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
      <ScenarioEntitiesHistoryList scenarioEntityId={params.scenarioEntityId} />
    </DashboardPage>
  );
}

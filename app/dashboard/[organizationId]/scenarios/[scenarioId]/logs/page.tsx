import { notFound } from 'next/navigation';
import React from 'react';
import { getScenarioHeaderById } from '../../../../../../database/scenarios';
import { TabType } from '../../../PageHeaderTabs';
import DashboardPage from '../../DashboardPage';
import ScenarioEntitiesList from './ScenarioEntitiesList';

type Props = {
  params: { scenarioId: string; organizationId: number };
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

  let activeTab = 't2';
  if (searchParams.filter === 'incomplete') {
    activeTab = 't3';
  }

  return (
    <DashboardPage
      heading={scenarioHeaderData.description || 'No descrition'}
      tabs={tabs}
      activeTab={activeTab}
    >
      <ScenarioEntitiesList
        scenarioId={Number(params.scenarioId)}
        orgId={params.organizationId}
        filter={searchParams.filter}
      />
    </DashboardPage>
  );
}

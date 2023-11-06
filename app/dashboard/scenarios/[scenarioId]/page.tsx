import { notFound } from 'next/navigation';
import React from 'react';
import {
  getScenarioHeaderById,
  getScenarioItems,
} from '../../../../database/scenarios';
import PageContent from '../../../PageContent';
import PageHeader from '../../../PageHeader';
import PageHeaderTabs, { TabType } from '../../../PageHeaderTabs';
import { ScenarioDiagram } from '../ScenarioDiagram';
import ScenarioStarter from '../ScenarioStarter';

type Props = {
  params: { scenarioId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ScenarioPage({ params, searchParams }: Props) {
  const logsLink = `/dashboard/scenarios/${Number(params.scenarioId)}/logs`;
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
    { tabTitle: 'Incomplete Executions', tabId: 't3', href: '/' },
  ];
  const sceanarioItemsData = await getScenarioItems(Number(params.scenarioId));
  const scenarioHeaderData = await getScenarioHeaderById(
    Number(params.scenarioId),
  );

  const scenarioId = scenarioHeaderData[0]?.scenarioId;

  return (
    <>
      <PageHeader
        heading={scenarioHeaderData[0]?.description || 'No descrition'}
      >
        <PageHeaderTabs tabs={tabs} activeTab={searchParams.tab} />
      </PageHeader>
      <PageContent>
        <ScenarioStarter
          scenarioId={scenarioId}
          context={`{"amountToApprove":500}`}
        />
        <ScenarioDiagram items={sceanarioItemsData} />
      </PageContent>
    </>
  );
}

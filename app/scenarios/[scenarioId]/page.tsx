import { notFound } from 'next/navigation';
import React from 'react';
import {
  getScenarioHeaderById,
  getScenarioItems,
} from '../../../database/scenarios';
import PageContent from '../../PageContent';
import PageHeader from '../../PageHeader';
import PageHeaderTabs, { TabType } from '../../PageHeaderTabs';
import { ScenarioDiagramm } from '../ScenarioDiagram';

type Props = {
  params: { scenarioId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ScenarioPage({ params, searchParams }: Props) {
  const tabs: TabType[] = [
    { tabTitle: 'Diagramm', tabId: 't1' },
    { tabTitle: 'History', tabId: 't2' },
    { tabTitle: 'Incomplete Executions', tabId: 't3' },
  ];
  const sceanarioItemsData = await getScenarioItems(Number(params.scenarioId));
  const scenarioHeaderData = await getScenarioHeaderById(
    Number(params.scenarioId),
  );

  return (
    <>
      <PageHeader
        heading={scenarioHeaderData[0]?.description || 'No descrition'}
      >
        <PageHeaderTabs tabs={tabs} activeTab={searchParams.tab} />
      </PageHeader>
      <PageContent>
        <ScenarioDiagramm items={sceanarioItemsData} />
      </PageContent>
    </>
  );
}

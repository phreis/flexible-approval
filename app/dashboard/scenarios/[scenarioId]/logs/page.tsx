import { notFound } from 'next/navigation';
import React from 'react';
import { getScenarioEntitiesByScenarioId } from '../../../../../database/scenarioEntities';
import {
  getScenarioHeaderById,
  getScenarioItems,
} from '../../../../../database/scenarios';
import PageContent from '../../../../PageContent';
import PageHeader from '../../../../PageHeader';
import PageHeaderTabs from '../../../../PageHeaderTabs';

type Props = {
  params: { scenarioId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ScenarioLogsPage({
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
    { tabTitle: 'Incomplete Executions', tabId: 't3', href: '/' },
  ];

  const sceanarioEntities = await getScenarioEntitiesByScenarioId(
    Number(params.scenarioId),
  );
  const scenarioHeaderData = await getScenarioHeaderById(
    Number(params.scenarioId),
  );

  const scenarioId = scenarioHeaderData[0]?.scenarioId;

  return (
    <>
      <PageHeader
        heading={scenarioHeaderData[0]?.description || 'No descrition'}
      >
        <PageHeaderTabs tabs={tabs} activeTab={'t2'} />
      </PageHeader>
      <PageContent>
        <ul>
          {sceanarioEntities?.map((ent) => {
            return (
              <li key={`key-ent.scenarioEntityId`}>{ent.scenarioEntityId}</li>
            );
          })}
        </ul>
      </PageContent>
    </>
  );
}

import { notFound } from 'next/navigation';
import React from 'react';
import {
  getScenarioHeaderById,
  getScenarioItems,
} from '../../../../../database/scenarios';
import { TabType } from '../../PageHeaderTabs';
import DashboardPage from '../DashboardPage';
import { ScenarioDiagram } from '../ScenarioDiagram';
import ScenarioStarter from '../ScenarioStarter';
import styles from './ScenarioPage.module.scss';

type Props = {
  params: { scenarioId: string; organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default async function ScenarioPage({ params, searchParams }: Props) {
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
    { tabTitle: 'Incomplete Executions', tabId: 't3', href: '/' },
  ];

  const scenarioHeaderData = await getScenarioHeaderById(
    Number(params.scenarioId),
  );

  const scenarioId = scenarioHeaderData[0]?.scenarioId;
  if (scenarioId) {
    return (
      <DashboardPage
        heading={scenarioHeaderData[0]?.description || 'No descrition'}
        tabs={tabs}
        activeTab={searchParams.tab}
      >
        <div className={styles.basicGridDivider}>
          <ScenarioDiagram scenarioId={scenarioId} />
          <ScenarioStarter
            scenarioId={scenarioId}
            organizationId={params.organizationId}
            context={`{"amountToApprove":500}`}
          />
        </div>
      </DashboardPage>
    );
  }
}

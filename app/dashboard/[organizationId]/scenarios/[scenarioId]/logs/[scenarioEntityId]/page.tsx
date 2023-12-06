import React from 'react';
import { getScenarioEntityById } from '../../../../../../../database/scenarioEntities';
import { getScenarioHeaderById } from '../../../../../../../database/scenarios';
import ScenarioTree from '../../../../../../ScenarioTree';
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

export default async function ScenarioEntityHistoryPage({ params }: Props) {
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

  const scenarioEntity = await getScenarioEntityById(params.scenarioEntityId);
  const rootNode = await new ScenarioTree(
    Number(params.scenarioId),
    scenarioEntity,
  ).getNodes();
  return (
    <DashboardPage
      heading={
        scenarioHeaderData?.description
          ? scenarioHeaderData.description
          : 'No description'
      }
      tabs={tabs}
      activeTab="t2"
    >
      <div className={styles.basicGridDivider}>
        {rootNode && <ScenarioDiagram rootNode={rootNode} />}
        <ScenarioEntitiesHistoryList
          scenarioEntityId={params.scenarioEntityId}
        />
      </div>
    </DashboardPage>
  );
}

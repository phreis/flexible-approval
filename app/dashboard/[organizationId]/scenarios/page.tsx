import { TabType } from '../PageHeaderTabs';
import DashboardPage from './DashboardPage';
import ScenariosHeader from './ScenariosHeader';
import styles from './ScenariosHeader.module.scss';

type Props = {
  params: { scenarioId: string; organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default function ScenariosPage({ params, searchParams }: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: 'All',
      tabId: 'all',
      href: `/dashboard/${params.organizationId}/scenarios`,
    },
    /*     { tabTitle: 'Active Scenarios', tabId: 'active', href: '/' },
    { tabTitle: 'Inactive Scenarios', tabId: 'inactive', href: '/' }, */
  ];

  return (
    <DashboardPage
      heading="All Scenarios"
      tabs={tabs}
      activeTab={searchParams.tab}
      toolBox={
        <div className={styles.toolsContainer}>
          <a href={`/dashboard/${params.organizationId}/scenarios/add/new`}>
            + Create a new scenario
          </a>
        </div>
      }
    >
      <ScenariosHeader />
    </DashboardPage>
  );
}

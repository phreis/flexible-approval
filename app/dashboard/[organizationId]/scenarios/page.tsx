import Link from 'next/link';
import PageContent from '../PageContent';
import PageHeader from '../PageHeader';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';
import DashboardPage from './DashboardPage';
import ScenariosHeader from './ScenariosHeader';

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
    >
      <ScenariosHeader />
    </DashboardPage>
  );
}

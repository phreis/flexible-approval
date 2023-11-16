import { TabType } from '../../PageHeaderTabs';
import DashboardPage from '../DashboardPage';
import ScenariosHeader from '../ScenariosHeader';

type Props = {
  params: { scenarioId: string; organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default function NewScenariosPage({ params, searchParams }: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: '',
      tabId: '',
      href: ``,
    },
    /*     { tabTitle: 'Active Scenarios', tabId: 'active', href: '/' },
    { tabTitle: 'Inactive Scenarios', tabId: 'inactive', href: '/' }, */
  ];

  return (
    <DashboardPage
      heading="Create a new scenario"
      tabs={tabs}
      activeTab={searchParams.tab}
    >
      here comes the magic...
    </DashboardPage>
  );
}

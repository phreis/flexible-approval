import Link from 'next/link';
import PageContent from '../PageContent';
import PageHeader from '../PageHeader';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';
import ScenariosHeader from './ScenariosHeader';

type Props = {
  params: { scenarioId: string; organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default function ScenariosPage({ searchParams }: Props) {
  const tabs: TabType[] = [
    { tabTitle: 'All', tabId: 'all', href: '/scenarios' },
    { tabTitle: 'Active Scenarios', tabId: 'active', href: '/' },
    { tabTitle: 'Inactive Scenarios', tabId: 'inactive', href: '/' },
  ];

  return (
    <>
      <PageHeader heading="All Scenarios">
        <PageHeaderTabs tabs={tabs} activeTab={searchParams.tab} />
      </PageHeader>
      <PageContent>
        {/*         <Link href="/dashboard/scenarios/add">Add new scenario</Link> */}
        <ScenariosHeader />
      </PageContent>
    </>
  );
}

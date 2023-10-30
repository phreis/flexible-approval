import Link from 'next/link';
import PageContent from '../PageContent';
import PageHeader from '../PageHeader';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';
import ScenariosHeader from './ScenariosHeader';

type Props = {
  params: { scenarioId: string };
  searchParams: { [key: string]: string | undefined };
};

export default function ScenariosPage({ searchParams }: Props) {
  const tabs: TabType[] = [
    { tabTitle: 'All', tabId: 'all' },
    { tabTitle: 'Active Scenarios', tabId: 'active' },
    { tabTitle: 'Inactive Scenarios', tabId: 'inactive' },
  ];

  return (
    <>
      <PageHeader heading="All Scenarios">
        <PageHeaderTabs tabs={tabs} activeTab={searchParams.tab} />
      </PageHeader>
      <PageContent>
        <Link href="/scenarios/add">Add new scenario</Link>
        <ScenariosHeader />
      </PageContent>
    </>
  );
}

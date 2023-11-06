import PageContent from '../PageContent';
import PageHeader from '../PageHeader';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';

type Props = {
  params: { scenarioId: string };
  searchParams: { [key: string]: string | undefined };
};

export default function HomePage({ searchParams }: Props) {
  const tabs: TabType[] = [
    { tabTitle: 'Tab1', tabId: 't1', href: '?tab=t1' },
    { tabTitle: 'Tab2', tabId: 't2', href: '?tab=t2' },
    { tabTitle: 'Tab3', tabId: 't3', href: '?tab=t3' },
  ];

  return (
    <>
      <PageHeader heading="Home">
        <PageHeaderTabs tabs={tabs} activeTab={searchParams.tab} />
      </PageHeader>
      <PageContent>
        <h2>{searchParams.tab} some content on teams page</h2>
      </PageContent>
    </>
  );
}

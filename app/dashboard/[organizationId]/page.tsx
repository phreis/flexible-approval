import { redirect } from 'next/navigation';
import { TabType } from './PageHeaderTabs';
import DashboardPage from './scenarios/DashboardPage';

type Props = {
  params: { organizationId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function OrganizationPage({
  params,
  searchParams,
}: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: 'Team',
      tabId: 't1',
      href: `/dashboard/${params.organizationId}/team`,
    },
    /*     { tabTitle: 'Tab2', tabId: 't2', href: '?tab=t2' },
    { tabTitle: 'Tab3', tabId: 't3', href: '?tab=t3' }, */
  ];

  // until the OrganizationPage is implemented, we redirect to scenarios
  redirect(`/dashboard/${params.organizationId}/scenarios`);

  return (
    <DashboardPage
      heading="page not yet implemented"
      tabs={tabs}
      activeTab={searchParams.tab}
    >
      <></>
    </DashboardPage>
  );
}

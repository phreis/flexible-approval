import { redirect } from 'next/navigation';
import {
  getOrganizationByUserName,
  getOrganizationLoggedIn,
} from '../../../database/organizations';
import { OrganizationType } from '../../../migrations/00000-createTableOrganizations';
import { getUserLoggedIn } from '../../lib/utils';
import PageContent from './PageContent';
import PageHeader from './PageHeader';
import PageHeaderTabs, { TabType } from './PageHeaderTabs';
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

  // until the OrganizationPage is implemented, we redirect to team
  redirect(`/dashboard/${params.organizationId}/team`);

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

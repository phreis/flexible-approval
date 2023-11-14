import { redirect } from 'next/navigation';
import {
  getOrganizationByUserName,
  getOrganizationLoggedIn,
} from '../../../database/organizations';
import { OrganizationType } from '../../../migrations/00004-createTableOrganizations';
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
    { tabTitle: 'Team', tabId: 't1', href: '?tab=t1' },
    { tabTitle: 'Tab2', tabId: 't2', href: '?tab=t2' },
    { tabTitle: 'Tab3', tabId: 't3', href: '?tab=t3' },
  ];

  const organizationLoggedIn = await getOrganizationLoggedIn();
  if (!organizationLoggedIn) {
    return;
  }

  return (
    <DashboardPage
      heading={
        organizationLoggedIn?.name
          ? organizationLoggedIn.name
          : 'My Organisation'
      }
      tabs={tabs}
      activeTab={searchParams.tab}
    >
      <>children</>
    </DashboardPage>
  );
}

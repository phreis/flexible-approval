import { getOrganizationLoggedIn } from '../../../../database/organizations';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';
import DashboardPage from '../scenarios/DashboardPage';
import TeamList from './TeamList';
import styles from './TeamList.module.scss';

type Props = {
  params: { organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default async function TeamPage({ params, searchParams }: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: 'Team',
      tabId: 't1',
      href: `/dashboard/${params.organizationId}/team`,
    },
    /*     { tabTitle: 'Tab2', tabId: 't2', href: '?tab=t2' },
    { tabTitle: 'Tab3', tabId: 't3', href: '?tab=t3' }, */
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
      <div className={styles.toolsContainer}>
        <a href={`/dashboard/${params.organizationId}/team/invite`}>
          + Invite a new user
        </a>
      </div>
      <TeamList orgId={params.organizationId} />
    </DashboardPage>
  );
}

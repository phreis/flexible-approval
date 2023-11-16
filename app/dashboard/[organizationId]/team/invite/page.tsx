import { TabType } from '../../PageHeaderTabs';
import DashboardPage from '../../scenarios/DashboardPage';
import Invite from './Invite';
import InvitedList from './InvitedList';
import styles from './InvitePage.module.scss';

type Props = {
  params: { organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default async function InvitePage({ params, searchParams }: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: 'Team',
      tabId: 't1',
      href: `/dashboard/${params.organizationId}/team`,
    },
    /*     { tabTitle: 'Tab2', tabId: 't2', href: '?tab=t2' },
    { tabTitle: 'Tab3', tabId: 't3', href: '?tab=t3' }, */
  ];

  return (
    <DashboardPage
      heading="Invite a new user"
      tabs={tabs}
      activeTab={searchParams.tab}
    >
      <div className={styles.basicGridDivider}>
        <Invite orgId={params.organizationId} />
        <InvitedList />
      </div>
    </DashboardPage>
  );
}

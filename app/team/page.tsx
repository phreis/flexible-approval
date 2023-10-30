import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../database/sessions';
import PageContent from '../PageContent';
import PageHeader from '../PageHeader';
import PageHeaderTabs, { TabType } from '../PageHeaderTabs';

type Props = {
  params: { scenarioId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function TeamPage({ searchParams }: Props) {
  const tabs: TabType[] = [
    { tabTitle: 'Tab1', tabId: 't1' },
    { tabTitle: 'Tab2', tabId: 't2' },
    { tabTitle: 'Tab3', tabId: 't3' },
  ];

  const headersList = headers();

  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  console.log('Check Xpath: ', headersList.get('x-pathname'));

  // User has to be an admin
  // Get user from the database that meets the admin requirements

  // 3. Either redirect or render the login form
  if (!session) redirect(`/login?returnTo=/team`);

  return (
    <>
      <PageHeader heading="Team">
        <PageHeaderTabs tabs={tabs} activeTab={searchParams.tab} />
      </PageHeader>
      <PageContent>
        <h2>{searchParams.tab} some content on teams page</h2>
      </PageContent>
    </>
  );
}

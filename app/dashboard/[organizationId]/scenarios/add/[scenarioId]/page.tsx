import { redirect } from 'next/navigation';
import {
  createScenario,
  getScenarioHeaderById,
} from '../../../../../../database/scenarios';
import { getUserByOrganization } from '../../../../../../database/users';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import ScenarioTree from '../../../../../ScenarioTree';
import { TabType } from '../../../PageHeaderTabs';
import DashboardPage from '../../DashboardPage';
import { ScenarioDiagram } from '../../ScenarioDiagram';
import styles from './NewScenarioPage.module.scss';
import ScenarioBuilder from './ScenarioBuilder';

type Props = {
  params: { scenarioId: string; organizationId: number };
  searchParams: { [key: string]: string | undefined };
};

export default async function NewScenarioPage({ params, searchParams }: Props) {
  const tabs: TabType[] = [
    {
      tabTitle: '',
      tabId: '',
      href: ``,
    },
    /*     { tabTitle: 'Active Scenarios', tabId: 'active', href: '/' },
    { tabTitle: 'Inactive Scenarios', tabId: 'inactive', href: '/' }, */
  ];

  // TODO: rework! pathlogic when scenario exists...
  // We immediately create a new Scenario when landing on this page with param 'new'
  let newScenario: ScenarioHeaderType | undefined;
  if (params.scenarioId === 'new') {
    newScenario = await createScenario({ description: 'New scenario' });
    redirect(
      `/dashboard/${params.organizationId}/scenarios/add/${newScenario?.scenarioId}`,
    );
  } else {
    newScenario = await getScenarioHeaderById(Number(params.scenarioId));
    if (!newScenario) {
      redirect(`/dashboard/${params.organizationId}/scenarios/add/new`);
    }
  }
  const users = await getUserByOrganization(params.organizationId);

  const rootNode = await new ScenarioTree(newScenario.scenarioId).getNodes();
  // console.log(util.inspect(rootNode, false, null, true /* enable colors */));
  return (
    <DashboardPage
      heading="Create a new scenario"
      tabs={tabs}
      activeTab={searchParams.tab}
    >
      <div className={styles.basicGridDivider}>
        <ScenarioBuilder scenario={newScenario} users={users} />
        {rootNode && <ScenarioDiagram rootNode={rootNode} />}
      </div>
    </DashboardPage>
  );
}

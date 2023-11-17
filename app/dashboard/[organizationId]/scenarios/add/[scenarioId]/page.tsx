import { redirect } from 'next/navigation';
import {
  createScenario,
  getScenarioHeaderById,
} from '../../../../../../database/scenarios';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { TabType } from '../../../PageHeaderTabs';
import DashboardPage from '../../DashboardPage';
import { ScenarioDiagram } from '../../ScenarioDiagram';
import ScenariosHeader from '../../ScenariosHeader';
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

  return (
    <DashboardPage
      heading="Create a new scenario"
      tabs={tabs}
      activeTab={searchParams.tab}
    >
      here comes the magic...
      <ScenarioBuilder scenarioId={newScenario.scenarioId} />
      <ScenarioDiagram scenarioId={newScenario.scenarioId} />
    </DashboardPage>
  );
}

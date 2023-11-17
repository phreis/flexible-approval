import util from 'node:util';
import dynamic from 'next/dynamic';
import { getScenarioItems } from '../../../../database/scenarios';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import { ScenarioItemType } from '../../../../migrations/00005-createTableScenarioItems';
import { ScenarioEntityType } from '../../../../migrations/00016-createTablescenarioEntities';
import ScenarioTree, { WfNode } from '../../../ScenarioTree';
import styles from './Scenario.module.scss';

// within Scenario we have <ul> within <li>, which leads to Haydration errors in Next14
// solved for now: https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Scenario = dynamic(() => import('./Scenario'), { ssr: false });

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  scenarioEntityId?: ScenarioEntityType['scenarioEntityId'];
};

export async function ScenarioDiagram(props: Props) {
  const sceanarioItemsData = await getScenarioItems(props.scenarioId);

  const tree = new ScenarioTree();

  sceanarioItemsData.forEach((item: ScenarioItemType) =>
    tree.insertNode({ ...item, children: null }),
  );

  const rootNode = tree.getNodes();
  // console.log(util.inspect(rootNode, false, null, true /* enable colors */));

  if (rootNode) {
    return (
      <div className={styles.tree}>
        <ul>
          <Scenario node={rootNode} scenarioEntityId={props.scenarioEntityId} />
        </ul>
      </div>
    );
  }
}

import util from 'node:util';
import dynamic from 'next/dynamic';
import { ScenarioItemType } from '../../../migrations/00003-createTableScenarioItems';
import { ScenarioEntityType } from '../../../migrations/00015-createTablescenarioEntities';
import ScenarioTree from '../../ScenarioTree';
import styles from './Scenario.module.scss';

// within Scenario we have <ul> within <li>, which leads to Haydration errors in Next14
// solved for now: https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
const Scenario = dynamic(() => import('./Scenario'), { ssr: false });

type Props = {
  items: ScenarioItemType[];
};

export function ScenarioDiagram(props: Props) {
  const tree = new ScenarioTree();
  props.items.forEach((item: ScenarioItemType) =>
    tree.insertNode({ ...item, children: null }),
  );

  const rootNode = tree.getNodes();
  // console.log(util.inspect(rootNode, false, null, true /* enable colors */));
  if (rootNode) {
    return (
      <div className={styles.tree}>
        <ul>
          <Scenario node={rootNode} />
        </ul>
      </div>
    );
  }
}

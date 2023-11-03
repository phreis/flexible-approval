import util from 'node:util';
import { ScenarioItemType } from '../../../migrations/00003-createTableScenarioItems';
import ScenarioTree from '../../ScenarioTree';
import Scenario from './Scenario';
import styles from './Scenario.module.scss';

type Props = {
  items: ScenarioItemType[];
};

export function ScenarioDiagram(props: Props) {
  const tree = new ScenarioTree();
  props.items.forEach((item: ScenarioItemType) =>
    tree.insertNode({ ...item, children: null }),
  );

  const rootNode = tree.getNodes();
  // console.log(rootNode);
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

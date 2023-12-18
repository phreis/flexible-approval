import { WfNode } from '../../../ScenarioTree';
import Scenario from './Scenario';
import styles from './Scenario.module.scss';

// within Scenario we have <ul> within <li>, which leads to Haydration errors in Next14
// solved for now: https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components
// const Scenario = dynamic(() => import('./Scenario'), { ssr: false });

type Props = {
  rootNode: WfNode;
  createMode?: boolean;
};

export function ScenarioDiagram({ rootNode, createMode = false }: Props) {
  return (
    <div className={styles.tree}>
      <ul>
        <Scenario node={rootNode} createMode={createMode} />
      </ul>
    </div>
  );
}

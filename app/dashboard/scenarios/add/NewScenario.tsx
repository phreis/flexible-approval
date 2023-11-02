'use client';
import React from 'react';
import ScenarioTree, { WfNode } from '../../../ScenarioTree';
import Scenario from '../Scenario';
import styles from '../Scenario.module.scss';

export default function NewScenario() {
  const tree = new ScenarioTree();
  const newNode: WfNode = {
    scenarioId: '2',
    stepId: '1',
    parentStepId: null,
    task: 'Initial',
    condStepResult: null,
    children: null,
  };
  tree.insertNode({ ...newNode });

  const rootNode = tree.getNodes();
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

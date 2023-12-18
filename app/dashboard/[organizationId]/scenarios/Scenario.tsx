import React from 'react';
import { WfNode, WfNodeType } from '../../../ScenarioTree';
import NodeAdder from './add/[scenarioId]/NodeAdder';
import NodeDeleter from './add/[scenarioId]/NodeDeleter';
import styles from './Scenario.module.scss';

type Props = {
  node: WfNode;
  createMode?: boolean;
};

export default function Scenario({ node, createMode = false }: Props) {
  let directChildNodes = null;
  if (createMode) {
    // we need to extract the direct child nodes w/o the referenced classes
    // (parent, children) b/c the client component NodeAdder does not take classes
    directChildNodes = node.node.children
      ? node.node.children.map((child): WfNodeType => {
          return { ...child.node, children: null, parent: null };
        })
      : null;
  }
  return (
    <li key={`key-${node.node.stepId}`}>
      <span className={styles.box}>
        {node.getTsx()}
        {createMode && (
          <div className={styles.toolBox}>
            <NodeAdder
              scenario={node.scenario}
              users={node.users}
              actual={{
                ...node.node,
                children: null,
                parent: null,
              }}
              parent={
                node.node.parent && {
                  ...node.node.parent.node,
                  children: null,
                  parent: null,
                }
              }
              directChildNodes={directChildNodes}
            />
            <NodeDeleter
              scenarioId={node.node.scenarioId}
              stepId={node.node.stepId}
              directChildNodes={directChildNodes}
            />
          </div>
        )}
      </span>
      <ul>
        {node.node.children?.map((subNode: WfNode) =>
          Scenario({ node: subNode, createMode: createMode }),
        )}
      </ul>
    </li>
  );
}

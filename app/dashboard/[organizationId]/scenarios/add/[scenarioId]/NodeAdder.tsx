'use client';
import React, { useState } from 'react';
import { ScenarioHeaderType } from '../../../../../../migrations/00003-createTableScenarioHeader';
import { User } from '../../../../../../migrations/00007-createTableUsers';
import { WfNodeType } from '../../../../../ScenarioTree';
import Modal from '../../Modal';
import styles from '../../ScenarioNode.module.scss';
import ScenarioBuilderModal from './ScenarioBuilderModal';

type Props = {
  scenario: ScenarioHeaderType;
  users: User[] | undefined;
  parent: WfNodeType | null;
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};
export default function NodeAdder(props: Props) {
  const [modal, setModal] = useState(false);
  const isVisible = () => {
    const numberOfChildren = props.directChildNodes
      ? props.directChildNodes.length
      : 0;
    switch (props.actual.taskType) {
      case 'TER':
        return false;
      case 'START':
      case 'EVENT':
        return numberOfChildren < 1;
      case 'ACTION':
      case 'COND':
        return numberOfChildren < 2;
      default:
        return false;
    }
  };
  if (isVisible()) {
    return (
      <>
        <button
          className={styles.iconCreate}
          title="add node"
          onClick={() => setModal(true)}
        />

        <Modal openModal={modal} closeModal={() => setModal(false)}>
          <ScenarioBuilderModal
            scenario={props.scenario}
            users={props.users}
            actual={props.actual}
            directChildNodes={props.directChildNodes}
          />
        </Modal>
      </>
    );
  }
}

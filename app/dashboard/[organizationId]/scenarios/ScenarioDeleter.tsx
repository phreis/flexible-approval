'use client';
import React, { useState } from 'react';
import { ScenarioHeaderType } from '../../../../migrations/00003-createTableScenarioHeader';
import ScenarioDeleterModal from './ScenarioDeleterModal';
import styles from './ScenariosHeader.module.scss';

export default function ScenarioDeleter(props: {
  scenarioId: ScenarioHeaderType['scenarioId'];
}) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <button
        className={styles.iconDelete}
        title="delete scenario"
        onClick={() => setModal(true)}
      />

      <ScenarioDeleterModal
        openModal={modal}
        closeModal={() => setModal(false)}
        scenarioId={props.scenarioId}
      />
    </>
  );
}

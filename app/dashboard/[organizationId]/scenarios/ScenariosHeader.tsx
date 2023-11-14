import Link from 'next/link';
import React from 'react';
import { getScenarioHeaders } from '../../../../database/scenarios';
import styles from './ScenariosHeader.module.scss';

export default async function Scenarios() {
  const scenariosHeader = await getScenarioHeaders();

  return (
    <div className={styles.container}>
      {scenariosHeader.map((scen) => {
        return (
          <a
            key={`key-${scen.scenarioId}`}
            href={`scenarios/${scen.scenarioId}`}
          >
            {scen.description}
            <span className={styles.subInfo}>
              Created on: {scen.creationdate.toLocaleString('de')}
            </span>
          </a>
        );
      })}
    </div>
  );
}

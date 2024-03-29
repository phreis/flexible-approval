import { getScenarioHeaders } from '../../../../database/scenarios';
import ScenarioDeleter from './ScenarioDeleter';
import styles from './ScenariosHeader.module.scss';

export default async function Scenarios() {
  const scenariosHeader = await getScenarioHeaders();

  return (
    <div className={styles.container}>
      {scenariosHeader &&
        scenariosHeader
          .sort((a, b) => b.creationdate.getTime() - a.creationdate.getTime())
          .map((scen) => {
            return (
              <div
                className={styles.containerEntry}
                key={`key-${scen.scenarioId}`}
              >
                <a href={`scenarios/${scen.scenarioId}`}>
                  {scen.description}
                  <span className={styles.subInfo}>
                    Created on: {scen.creationdate.toLocaleString('de')}
                  </span>
                </a>
                <ScenarioDeleter scenarioId={scen.scenarioId} />
              </div>
            );
          })}
    </div>
  );
}

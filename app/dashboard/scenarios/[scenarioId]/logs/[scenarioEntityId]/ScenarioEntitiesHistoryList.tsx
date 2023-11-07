import React, { Fragment } from 'react';
import { getScenarioEntityHistoryById } from '../../../../../../database/scenarioEntityHistory';
import { ScenarioEntityType } from '../../../../../../migrations/00015-createTablescenarioEntities';
import { ScenarioEntityHistoryType } from '../../../../../../migrations/00017-createTablescenarioEntityHistory';
import styles from './ScenarioEntitiesHistoryList.module.scss';

type Props = {
  scenarioEntityId: ScenarioEntityType['scenarioEntityId'];
};

export default async function ScenarioEntitiesHistoryList(props: Props) {
  const sceanarioHistoryEntities = await getScenarioEntityHistoryById(
    props.scenarioEntityId,
  );

  return (
    <div className={styles.grid}>
      <span>
        <strong>STEP</strong>
      </span>
      <span>
        <strong>TASK</strong>
      </span>
      <span>
        <strong>TASK ID</strong>
      </span>
      <span>
        <strong>COND RESULT</strong>
      </span>
      <span>
        <strong>ACTION RESULT</strong>
      </span>
      <span>
        <strong>STATE</strong>
      </span>{' '}
      <span>
        <strong>MESSAGE</strong>
      </span>
      <span>
        <strong>USER</strong>
      </span>
      <span>
        <strong>STARTED</strong>
      </span>
      {sceanarioHistoryEntities.map((ent: ScenarioEntityHistoryType) => {
        return (
          <Fragment key={`key-${ent.historyId}`}>
            <span>{ent.stepId}</span>
            <span>{ent.taskType}</span>
            <span>{ent.taskId}</span>
            <span>
              {ent.condResult === true
                ? 'true'
                : ent.condResult === false
                ? 'false'
                : '-'}
            </span>
            <span>{ent.actionResult}</span>
            <span>{ent.state}</span>
            <span>{ent.message}</span>
            <span>{ent.username}</span>
            <span>{ent.creationdate.toLocaleString('de')}</span>
          </Fragment>
        );
      })}
    </div>
  );
}

// < key={`key-ent.scenarioEntityId`}>

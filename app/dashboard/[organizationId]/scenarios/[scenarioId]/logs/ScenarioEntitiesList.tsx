import React, { Fragment } from 'react';
import {
  getScenarioEntitiesListByScenarioId,
  ScenarioEntityListType,
} from '../../../../../../database/scenarioEntities';
import { OrganizationType } from '../../../../../../migrations/00000-createTableOrganizations';
import { ScenarioHeaderType } from '../../../../../../migrations/00001-createTableScenarioHeader';
import styles from './ScenarioEntitiesList.module.scss';

type Props = {
  scenarioId: ScenarioHeaderType['scenarioId'];
  filter?: string | undefined;
  orgId: OrganizationType['orgId'];
};

export default async function ScenarioEntitiesList(props: Props) {
  const scenarioEntities = await getScenarioEntitiesListByScenarioId(
    props.scenarioId,
    props.orgId,
    props.filter,
  );

  return (
    <div className={styles.grid}>
      <span>
        <strong>STARTED</strong>
      </span>
      <span>
        <strong>STATUS</strong>
      </span>
      <span>
        <strong>CONTEXT</strong>
      </span>
      <span>
        <strong>MESSAGE</strong>
      </span>
      <span></span>

      {scenarioEntities.map((ent: ScenarioEntityListType) => {
        return (
          <Fragment key={`key-${ent.scenarioEntityId}`}>
            <span>{ent.creationdate.toLocaleString('de')}</span>
            <span>{ent.state}</span>
            <span>{ent.context}</span>
            <span>{ent.message}</span>
            <span>
              <a
                href={`/dashboard/${props.orgId}/scenarios/${ent.scenarioId}/logs/${ent.scenarioEntityId}`}
              >
                DETAILS
              </a>
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

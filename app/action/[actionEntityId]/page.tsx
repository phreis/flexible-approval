import React from 'react';
import { getScenarioEntityHistoryByHistoryId } from '../../../database/scenarioEntityHistory';
import ActionForm from './ActionForm';

type Props = {
  params: { actionEntityId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function ActionEntiyPage(props: Props) {
  const actionEntity = await getScenarioEntityHistoryByHistoryId(
    props.params.actionEntityId,
  );
  if (!actionEntity) {
    return <main>{`${props.params.actionEntityId} does not exitst`}</main>;
  } else {
    return (
      <main>
        <ActionForm />
      </main>
    );
  }
}

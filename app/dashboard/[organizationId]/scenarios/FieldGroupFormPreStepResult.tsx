import React from 'react';
import { WfNodeType } from '../../../ScenarioTree';

type Props = {
  actual: WfNodeType;
  directChildNodes: WfNodeType[] | null;
};

export default function FieldGroupFormResult(props: Props) {
  const valCond = ['TRUE', 'FALSE'];
  const valAction = ['approved', 'rejected'];

  if (props.directChildNodes) {
    props.directChildNodes.forEach((child) => {
      if (child.preStepComparativeValue) {
        valCond.splice(valCond.indexOf(child.preStepComparativeValue), 1);
        valAction.splice(valAction.indexOf(child.preStepComparativeValue), 1);
      }
    });
  }
  if (props.actual.taskType === 'ACTION' || props.actual.taskType === 'COND') {
    return (
      <span>
        <label htmlFor="onResult">on Result</label>
        {props.actual.taskType === 'COND' && (
          <select id="onResult" name="onResult">
            {valCond.map((val) => {
              return (
                <option key={`key-${val}`} value={val}>
                  {val}
                </option>
              );
            })}
          </select>
        )}
        {props.actual.taskType === 'ACTION' && (
          <select id="onResult" name="onResult">
            {valAction.map((val) => {
              return (
                <option key={`key-${val}`} value={val}>
                  {val}
                </option>
              );
            })}
          </select>
        )}
      </span>
    );
  }
}

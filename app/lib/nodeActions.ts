'use server';

import { revalidatePath } from 'next/cache';
import { NextURL } from 'next/dist/server/web/next-url';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  createActionDefinition,
  CreateActionDefinitionType,
} from '../../database/actionDefinitions';
import {
  createConditionHeader,
  createConditionItem,
  CreateConditionItemType,
} from '../../database/conditions';
import {
  createEventDefinition,
  CreateEventDefinitionType,
} from '../../database/eventDefinitions';
import { getOrganizationLoggedIn } from '../../database/organizations';
import {
  createScenarioItem,
  CreateScenarioItemType,
  updateScenarioHeader,
  UpdateScenarioHeaderType,
} from '../../database/scenarios';
import { OrganizationType } from '../../migrations/00001-createTableOrganizations';
import { ScenarioHeaderType } from '../../migrations/00003-createTableScenarioHeader';
import { ScenarioItemType } from '../../migrations/00005-createTableScenarioItems';
import { getContextAttributeName } from './utils';

type ScenarioBuilderNodeGenericType = {
  orgId: OrganizationType['orgId'];
  scenarioId: ScenarioHeaderType['scenarioId'];
  taskType: ScenarioItemType['taskType'];
  // parentStepId: ScenarioItemType['parentStepId'] | undefined
};

// generic Action called by ScenarioBuilder on createNode
export async function scenarioBuilderAction(
  prevState: any,
  formData: FormData,
) {
  const scenarioBuilderSchema = z.object({
    scenarioId: z.number(),
    taskType: z.string(),
    parentStepId: z.number().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderSchema.safeParse({
    scenarioId: Number(formData.get('scenarioId')),
    taskType: formData.get('taskType'),
    parentStepId: Number(formData.get('parentStepId')),
  });

  // If form validation fails, return early. Otherwise, continue.
  if (!validatedBuilderFields.success) {
    console.log(validatedBuilderFields.error);
    return {
      message: 'Err on generic input fields',
    };
  }

  const { scenarioId, taskType, parentStepId } = validatedBuilderFields.data;
  const orgLoggedIn = await getOrganizationLoggedIn();
  const orgId = orgLoggedIn?.orgId;
  if (!orgId) {
    return {
      message: 'Err on determining Organization',
    };
  }

  const nodeGeneric: ScenarioBuilderNodeGenericType = {
    orgId: orgId,
    scenarioId: scenarioId,
    taskType: taskType,
  };
  try {
    switch (taskType) {
      case 'START':
        await createNodeStart(nodeGeneric, formData);
        break;
      case 'COND':
        await createNodeCond(nodeGeneric, formData);
        break;
      case 'ACTION':
        await createNodeAction(nodeGeneric, formData);
        break;
      case 'EVENT':
        await createNodeEvent(nodeGeneric, formData);
        break;
      case 'TER':
        await createNodeTer(nodeGeneric, formData);
        break;
      default:
      // return <></>;
    }
  } catch (e: any) {
    return {
      message: e,
    };
  }
  revalidatePath('/');
  /*   return {
    message: `Node Type: ${nodeGeneric.taskType} created on scenarioId: ${nodeGeneric.scenarioId}`,
  }; */
}

async function createNodeStart(
  nodeGeneric: ScenarioBuilderNodeGenericType,
  formData: FormData,
) {
  const scenarioBuilderNodeStartSchema = z.object({
    description: z.string(),
    contextDataDescription: z.string(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeStartSchema.safeParse({
    description: formData.get('description'),
    contextDataDescription: formData.get('contextDataDescription'),
  });

  // If form validation fails, return early. Otherwise, continue.
  if (!validatedBuilderFields.success) {
    // console.log(validatedBuilderFields.error);
    return {
      message: 'Err on Start Node input fields',
    };
  }

  const { description, contextDataDescription } = validatedBuilderFields.data;

  // try to parse the ContextDataDescription
  try {
    JSON.parse(contextDataDescription);
  } catch (e) {
    throw `Please provide the Context Data Description as the string representation of an JavaScript Object E.g.: {"attributeName": "string"}`;
  }

  // §1 update scenario w/ description, contextDataDescription
  const headerUpdate: UpdateScenarioHeaderType = {
    orgId: nodeGeneric.orgId,
    scenarioId: nodeGeneric.scenarioId,
    description: description,
    contextDataDescription: contextDataDescription,
  };

  const updatedHeader = await updateScenarioHeader(headerUpdate);
  if (!updatedHeader) {
    throw `Err on updating Scenario Header: ${headerUpdate.scenarioId}`;
  }

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    throw `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`;
  }
}
async function createNodeTer(
  nodeGeneric: ScenarioBuilderNodeGenericType,
  formData: FormData,
) {
  const scenarioBuilderNodeTerSchema = z.object({
    parentId: z.number(),
    condStepResult: z.string().optional(),
    actionStepResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeTerSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    condStepResult: formData.get('condStepResult'),
    actionStepResult: formData.get('actionStepResult'),
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    throw 'Err on Cond Node input fields';
  }
  const { parentId, condStepResult, actionStepResult } =
    validatedBuilderFields.data;

  function getCondResultBool(condStepResult: string | undefined) {
    if (condStepResult === 'NULL') {
      return null;
    }
    if (condStepResult === 'TRUE') {
      return true;
    }
    if (condStepResult === 'FALSE') {
      return false;
    }
  }

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    condStepResult: getCondResultBool(condStepResult),
    actionStepResult: actionStepResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    throw `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`;
  }
}
async function createNodeCond(
  nodeGeneric: ScenarioBuilderNodeGenericType,
  formData: FormData,
) {
  const scenarioBuilderNodeCondSchema = z.object({
    parentId: z.number(),
    description: z.string(),
    contextAttributeName: z.string(),
    operator: z.string(),
    compConstant: z.number(),
    condStepResult: z.string().optional(),
    actionStepResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeCondSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    description: formData.get('description'),

    contextAttributeName: formData.get('contextAttributeName'),
    operator: formData.get('operator'),
    compConstant: Number(formData.get('compConstant')),
    condStepResult: formData.get('condStepResult'),
    actionStepResult: formData.get('actionStepResult'),
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    throw 'Err on Cond Node input fields';
  }
  const {
    parentId,
    description,
    contextAttributeName,
    operator,
    compConstant,
    condStepResult,
    actionStepResult,
  } = validatedBuilderFields.data;

  // §1 create condtion definition
  const newConditionHeader = await createConditionHeader({
    scenarioId: nodeGeneric.scenarioId,
    description: description,
  });

  if (!newConditionHeader) {
    throw `Err on creating Scenario Definition Header`;
  }
  const condItemNew: CreateConditionItemType = {
    conditionId: newConditionHeader.conditionId,
    contextAttributeName: contextAttributeName,
    comperator: operator,
    compConstant: compConstant,
    linkConditionNext: null,
  };
  const newConditionItem = await createConditionItem(condItemNew);

  function getCondResultBool(condStepResult: string | undefined) {
    if (condStepResult === 'NULL') {
      return null;
    }
    if (condStepResult === 'TRUE') {
      return true;
    }
    if (condStepResult === 'FALSE') {
      return false;
    }
  }

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    taskId: newConditionHeader.conditionId,
    condStepResult: getCondResultBool(condStepResult),
    actionStepResult: actionStepResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    throw `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`;
  }
}

async function createNodeAction(
  nodeGeneric: ScenarioBuilderNodeGenericType,
  formData: FormData,
) {
  const scenarioBuilderNodeActionSchema = z.object({
    parentId: z.number(),
    description: z.string(),
    approver: z.string(),
    textTemplate: z.string(),
    condStepResult: z.string().optional(),
    actionStepResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeActionSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    description: formData.get('description'),

    textTemplate: formData.get('textTemplate'),
    approver: formData.get('approver'),
    condStepResult: formData.get('condStepResult'),
    actionStepResult: formData.get('actionStepResult'),
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    throw 'Err on Cond Node input fields';
  }
  const {
    parentId,
    description,
    textTemplate,
    approver,
    condStepResult,
    actionStepResult,
  } = validatedBuilderFields.data;

  const actionNew: CreateActionDefinitionType = {
    scenarioId: nodeGeneric.scenarioId,
    approver: approver,
    description: description,
    textTemplate: textTemplate,
  };
  const newActionItem = await createActionDefinition(actionNew);

  function getCondResultBool(condStepResult: string | undefined) {
    if (condStepResult === 'NULL') {
      return null;
    }
    if (condStepResult === 'TRUE') {
      return true;
    }
    if (condStepResult === 'FALSE') {
      return false;
    }
  }

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    taskId: newActionItem?.actionId,
    condStepResult: getCondResultBool(condStepResult),
    actionStepResult: actionStepResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    throw `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`;
  }
}

async function createNodeEvent(
  nodeGeneric: ScenarioBuilderNodeGenericType,
  formData: FormData,
) {
  const scenarioBuilderNodeEventSchema = z.object({
    parentId: z.number(),
    description: z.string(),
    recipient: z.string(),
    textTemplate: z.string(),
    condStepResult: z.string().optional(),
    actionStepResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeEventSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    description: formData.get('description'),

    textTemplate: formData.get('textTemplate'),
    recipient: formData.get('recipient'),
    condStepResult: formData.get('condStepResult'),
    actionStepResult: formData.get('actionStepResult'),
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    throw 'Err on Cond Node input fields';
  }
  const {
    parentId,
    description,
    textTemplate,
    recipient,
    condStepResult,
    actionStepResult,
  } = validatedBuilderFields.data;

  const eventNew: CreateEventDefinitionType = {
    scenarioId: nodeGeneric.scenarioId,
    recipient: recipient,
    description: description,
    textTemplate: textTemplate,
  };
  const newEventItem = await createEventDefinition(eventNew);

  function getCondResultBool(condStepResult: string | undefined) {
    if (condStepResult === 'NULL') {
      return null;
    }
    if (condStepResult === 'TRUE') {
      return true;
    }
    if (condStepResult === 'FALSE') {
      return false;
    }
  }

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    taskId: newEventItem?.eventId,
    condStepResult: getCondResultBool(condStepResult),
    actionStepResult: actionStepResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    throw `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`;
  }
}

export async function startNodeFormAction(prevState: any, formData: FormData) {
  console.log('startNodeFormAction: ', formData);
  return {
    message: `Successfully`,
  };
}
export async function condNodeFormAction(formData: FormData) {
  console.log('condNodeFormAction: ', formData);
  console.log(JSON.parse(formData.get('node')));
  return {
    message: `Successfully`,
  };
}

'use server';

import { revalidatePath } from 'next/cache';
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
  deleteScenarioItem,
  DeleteScenarioItemType,
  updateScenarioHeader,
  UpdateScenarioHeaderType,
} from '../../database/scenarios';
import { OrganizationType } from '../../migrations/00001-createTableOrganizations';
import { ScenarioHeaderType } from '../../migrations/00003-createTableScenarioHeader';
import { ScenarioItemType } from '../../migrations/00005-createTableScenarioItems';

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

  const { scenarioId, taskType } = validatedBuilderFields.data;
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
  let error;

  switch (taskType) {
    case 'START':
      error = await createNodeStart(nodeGeneric, formData);
      break;
    case 'COND':
      error = await createNodeCond(nodeGeneric, formData);
      break;
    case 'ACTION':
      error = await createNodeAction(nodeGeneric, formData);
      break;
    case 'EVENT':
      error = await createNodeEvent(nodeGeneric, formData);
      break;
    case 'TER':
      error = await createNodeTer(nodeGeneric, formData);
      break;
    default:
    // return <></>;
  }
  if (error) {
    return {
      message: error.message,
    };
  }
  revalidatePath('/');
  return { actionProcessed: true };
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
    return {
      message: `Please provide the Input Data Description as the string representation of an JavaScript Object E.g.: {"attributeName": "string"}`,
    };
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
    return {
      message: `Err on updating Scenario Header: ${headerUpdate.scenarioId}`,
    };
  }

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    return {
      message: `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`,
    };
  }
}
async function createNodeTer(
  nodeGeneric: ScenarioBuilderNodeGenericType,
  formData: FormData,
) {
  const scenarioBuilderNodeTerSchema = z.object({
    parentId: z.number(),
    onResult: z.string().optional(),
  });

  // Field Validation

  const validatedBuilderFields = scenarioBuilderNodeTerSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    onResult: formData.get('onResult') || undefined,
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    return {
      message: 'Err on Ter Node input fields',
    };
  }
  const { parentId, onResult } = validatedBuilderFields.data;

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    preStepComparativeValue: onResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    return {
      message: `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`,
    };
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
    onResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeCondSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    description: formData.get('description'),

    contextAttributeName: formData.get('contextAttributeName'),
    operator: formData.get('operator'),
    compConstant: Number(formData.get('compConstant')),
    onResult: formData.get('onResult') || undefined,
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    return {
      message: 'Err on Cond Node input fields',
    };
  }
  const {
    parentId,
    description,
    contextAttributeName,
    operator,
    compConstant,
    onResult,
  } = validatedBuilderFields.data;

  // §1 create condtion definition
  const newConditionHeader = await createConditionHeader({
    scenarioId: nodeGeneric.scenarioId,
    description: description,
  });

  if (!newConditionHeader) {
    return {
      message: `Err on creating Scenario Definition Header`,
    };
  }
  const condItemNew: CreateConditionItemType = {
    conditionId: newConditionHeader.conditionId,
    contextAttributeName: contextAttributeName,
    comperator: operator,
    compConstant: compConstant,
    linkConditionNext: null,
  };
  await createConditionItem(condItemNew);
  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    taskId: newConditionHeader.conditionId,
    preStepComparativeValue: onResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    return {
      message: `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`,
    };
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
    onResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeActionSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    description: formData.get('description'),

    textTemplate: formData.get('textTemplate'),
    approver: formData.get('approver'),
    onResult: formData.get('onResult') || undefined,
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    return {
      message: 'Err on Action Node input fields',
    };
  }
  const { parentId, description, textTemplate, approver, onResult } =
    validatedBuilderFields.data;

  const actionNew: CreateActionDefinitionType = {
    scenarioId: nodeGeneric.scenarioId,
    approver: approver,
    description: description,
    textTemplate: textTemplate,
  };
  const newActionItem = await createActionDefinition(actionNew);

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    taskId: newActionItem?.actionId,
    preStepComparativeValue: onResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    return {
      message: `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`,
    };
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
    onResult: z.string().optional(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeEventSchema.safeParse({
    parentId: Number(formData.get('parentStepId')),
    description: formData.get('description'),

    textTemplate: formData.get('textTemplate'),
    recipient: formData.get('recipient'),
    onResult: formData.get('onResult') || undefined,
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    return {
      message: 'Err on Event Node input fields',
    };
  }
  const { parentId, description, textTemplate, recipient, onResult } =
    validatedBuilderFields.data;

  const eventNew: CreateEventDefinitionType = {
    scenarioId: nodeGeneric.scenarioId,
    recipient: recipient,
    description: description,
    textTemplate: textTemplate,
  };
  const newEventItem = await createEventDefinition(eventNew);

  // §2 create node
  const newItem: CreateScenarioItemType = {
    scenarioId: nodeGeneric.scenarioId,
    taskType: nodeGeneric.taskType,
    parentStepId: parentId,
    taskId: newEventItem?.eventId,
    preStepComparativeValue: onResult,
  };
  const item = await createScenarioItem(newItem);
  if (!item) {
    return {
      message: `Err on creation Node Type ${nodeGeneric.taskType} on Scenario ${nodeGeneric.scenarioId}`,
    };
  }
}

export async function scenarioItemDeleteAction(
  prevState: any,
  formData: FormData,
) {
  const scenarioBuilderNodeEventSchema = z.object({
    scenarioId: z.number(),
    stepId: z.number(),
  });

  // Field Validation
  const validatedBuilderFields = scenarioBuilderNodeEventSchema.safeParse({
    scenarioId: Number(formData.get('scenarioId')),
    stepId: Number(formData.get('stepId')),
  });

  // If form validation fails, return early. Otherwise, continue.

  if (!validatedBuilderFields.success) {
    return {
      message: 'Err on Node Deleter input fields',
    };
  }
  const { scenarioId, stepId } = validatedBuilderFields.data;

  const itemToDelete: DeleteScenarioItemType = {
    scenarioId: scenarioId,
    stepId: stepId,
  };

  const deletedItem = await deleteScenarioItem(itemToDelete);
  if (!deletedItem) {
    return {
      message: `Err on deleting Node`,
    };
  }
  revalidatePath('/');
}

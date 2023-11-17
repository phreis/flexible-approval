'use server';

export async function scenarioBuilderAction(
  prevState: any,
  formData: FormData,
) {
  console.log('scenarioBuilderAction: ', formData);
  return {
    message: `Successfully`,
  };
}

export async function startNodeFormAction(prevState: any, formData: FormData) {
  console.log('startNodeFormAction: ', formData);
  return {
    message: `Successfully`,
  };

  /*   const historyId = String(formData.get('historyId'));
  let actionResponse;

  if (historyId) {
    if (formData.get('approve')) {
      actionResponse = 'approved';
    }
    if (formData.get('reject')) {
      actionResponse = 'rejected';
    }
    if (!actionResponse) {
      return {
        message: `Form error`,
      };
    }
    try {
      await processActionResult(historyId, actionResponse);
    } catch (e: any) {
      return {
        message: `Error: ${e.message}`,
      };
    }

    return {
      message: `Successfully ${actionResponse} - you can close this window now.`,
    };
  } */
}
export async function condNodeFormAction(formData: FormData) {
  console.log('condNodeFormAction: ', formData);
  console.log(JSON.parse(formData.get('node')));
  return {
    message: `Successfully`,
  };
}

export async function createConditionHeaderAction(formData: FormData) {
  console.log('condNodeFormAction: ', formData);
  console.log(JSON.parse(formData.get('node')));
  return {
    message: `Successfully`,
  };
}

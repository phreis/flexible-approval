'use server';

import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  createOrganization,
  getOrganizationLoggedIn,
} from '../../database/organizations';
import { createScenarioEntity } from '../../database/scenarioEntities';
import { createSession, deleteSessionByToken } from '../../database/sessions';
import {
  createUser,
  getUserByUsername,
  getUserWithPasswordHashByUsername,
} from '../../database/users';
import { processActionResult, processScenarioEntity } from './processor';
import { getSafeReturnToPath, secureCookieOptions } from './utils';

export async function registerUser(prevState: any, formData: FormData) {
  const registerSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
  });

  // 1. Validate the user data
  const validatedFields = registerSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    email: formData.get('email'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to register User.',
    };
  }

  const { username, password, email } = validatedFields.data;

  // 2. Check if user already exist in the database

  const userAlreadyThere = await getUserByUsername(username);
  if (userAlreadyThere) {
    return {
      message: `Username ${userAlreadyThere.username} already taken`,
    };
  }

  // 3. Hash the plain password from the user

  // 3.1 get a new Organization
  const newOrganization = await createOrganization('My Organization');
  if (!newOrganization?.orgId) {
    return {
      message: `Error on creation new Organization`,
    };
  }
  const passwordHash = await bcrypt.hash(password, 12);
  // 4. Save the user information with the hashed password in the database
  const newUser = await createUser(
    newOrganization.orgId,
    username,
    passwordHash,
    email,
    'admin',
  );

  if (!newUser) {
    return {
      message: `Error creating the new user`,
    };
  }
  // 4. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // 5. Create the session record
  const session = await createSession(newUser.id, token, newOrganization.orgId);

  if (!session) {
    return {
      message: `Error creating the new session`,
    };
  }

  // 6. Send the new cookie in the headers

  // cookies().set({
  //   name: 'sessionToken',
  //   value: session.token,
  //   httpOnly: true,
  //   path: '/',
  //   secure: process.env.NODE_ENV === 'production',
  //   maxAge: 60 * 60 * 48, // Expires in 24 hours,
  //   sameSite: 'lax', // this prevents CSRF attacks
  // });

  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });
}
export async function loginUser(prevState: any, formData: FormData) {
  const registerSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
  });

  // 1. Validate the user data
  const validatedFields = registerSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to login User.',
    };
  }

  const { username, password } = validatedFields.data;

  // 2. verify the user credentials
  const userWithPasswordHash =
    await getUserWithPasswordHashByUsername(username);

  if (!userWithPasswordHash) {
    return {
      message: `Username and/or Password not valid`,
    };
  }

  // 3. Validate the user password by comparing with hashed password
  const isPasswordValid = await bcrypt.compare(
    password,
    userWithPasswordHash.passwordHash,
  );
  if (!isPasswordValid) {
    return {
      message: `Username and/or Password not valid`,
    };
  }

  // 4. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // console.log('userWithPasswordHash: ', userWithPasswordHash.orgId);

  // 5. Create the session record
  const session = await createSession(
    userWithPasswordHash.id,
    token,
    userWithPasswordHash.orgId,
  );

  if (!session) {
    return {
      message: `Error creating the new session`,
    };
  }

  // 6. Send the new cookie in the headers

  // cookies().set({
  //   name: 'sessionToken',
  //   value: session.token,
  //   httpOnly: true,
  //   path: '/',
  //   secure: process.env.NODE_ENV === 'production',
  //   maxAge: 60 * 60 * 48, // Expires in 24 hours,
  //   sameSite: 'lax', // this prevents CSRF attacks
  // });

  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  const x = getSafeReturnToPath(formData.get('returnTo')?.toString() || `/`);
  if (x) {
    redirect(x);
  }

  // router.push(
  //   getSafeReturnToPath(props.returnTo) || `/profile/${data.user.username}`,
  // );

  // revalidatePath() throws unnecessary error, will be used when stable
  // revalidatePath('/(auth)/login', 'page');
  // router.refresh();
}
export async function logout() {
  // Get the session token from the cookie
  const cookieStore = cookies();

  const token = cookieStore.get('sessionToken');

  //  Delete the session from the database based on the token
  if (token) await deleteSessionByToken(token.value);

  // Delete the session cookie from the browser
  cookieStore.set('sessionToken', '', {
    maxAge: -1,
  });
}

export async function processScenarioNewAction(
  prevState: any,
  formData: FormData,
) {
  const registerSchema = z.object({
    scenarioId: z.string(),
    context: z.string(),
  });

  // 1. Validate the user data
  const validatedFields = registerSchema.safeParse({
    scenarioId: formData.get('scenarioId'),
    context: formData.get('context'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to start scenario.',
    };
  }

  const { scenarioId, context } = validatedFields.data;

  // Create new Scenario Entity:
  const scenarioEntiy = await createScenarioEntity({
    scenarioId: Number(scenarioId),
    context: context,
  });
  if (scenarioEntiy) {
    try {
      await processScenarioEntity(scenarioEntiy);
    } catch (e: any) {
      return {
        errors: `Error: ${e.message}`,
      };
    }
    /*     return {
      message: `Scenario started`,
      scenarioEntityId: scenarioEntiy.scenarioEntityId,
    }; */
    const orgLoggedIn = await getOrganizationLoggedIn();

    redirect(
      `/dashboard/${orgLoggedIn?.orgId}/scenarios/${scenarioId}/logs/${scenarioEntiy.scenarioEntityId}`,
    );
  }
}

export async function processActionResultAction(
  prevState: any,
  formData: FormData,
) {
  const historyId = String(formData.get('historyId'));
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
  }
}

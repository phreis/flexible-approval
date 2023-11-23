'use server';

import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  acceptInvitation,
  createInvitation,
  getInvitationById,
  getInvitedUsersByUsername,
} from '../../database/invitations';
import {
  createOrganization,
  getOrganizationLoggedIn,
} from '../../database/organizations';
import { createScenarioEntity } from '../../database/scenarioEntities';
import { deleteScenario } from '../../database/scenarios';
import { createSession, deleteSessionByToken } from '../../database/sessions';
import {
  createUser,
  getUserByUsername,
  getUserWithPasswordHashByUsername,
} from '../../database/users';
import { sendEmail, sendEmailRsvp } from './email';
import { processActionResult, processScenarioEntity } from './processor';
import { getSafeReturnToPath, secureCookieOptions } from './utils';

// User sign up on invitation response
export async function rsvpAction(prevState: any, formData: FormData) {
  if (formData.get('invitationId') === null) {
    return {
      message: 'Err: Invitation ID not provided',
    };
  } else {
    const invitationId = String(formData.get('invitationId'));

    const rsvpSchema = z.object({
      password: z.string().min(5),
      rePassword: z.string().min(5),
    });

    // Field Validation
    const validatedFields = rsvpSchema.safeParse({
      password: formData.get('password'),
      rePassword: formData.get('repassword'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to register User.',
      };
    }

    const { password, rePassword } = validatedFields.data;
    if (password !== rePassword) {
      return {
        message: 'Passwords to not match',
      };
    }

    const invitation = await getInvitationById(invitationId);
    if (!invitation) {
      return {
        message: 'Err: Invitation ID not found',
      };
    }
    // --> Create Use based on the pre-registeration (Invitation)

    // 1. Again, Check if user already exist in the database

    const userAlreadyThere = await getUserByUsername(invitation.username);
    if (userAlreadyThere) {
      return {
        message: `Username ${userAlreadyThere.username} already taken`,
      };
    }

    // 2. Hash the plain password from the user
    const passwordHash = await bcrypt.hash(password, 12);
    // 3. Save the user information with the hashed password in the database
    const newUser = await createUser(
      invitation.orgId,
      invitation.username,
      passwordHash,
      invitation.email,
      invitation.role,
    );

    if (!newUser) {
      return {
        message: `Error creating the new user`,
      };
    }

    // 4. Update Invitation
    await acceptInvitation(invitation.invitationId);

    // 5. Create a token
    const token = crypto.randomBytes(100).toString('base64');

    // 6. Create the session record
    const session = await createSession(newUser.id, token, newUser.orgId);

    if (!session) {
      return {
        message: `Error creating the new session`,
      };
    }

    // 7. Send the new cookie in the headers
    cookies().set({
      name: 'sessionToken',
      value: session.token,
      ...secureCookieOptions,
    });
    redirect(`/dashboard/${newUser.orgId}/scenarios`);
  }
}
export async function preRegisterUserAction(
  prevState: any,
  formData: FormData,
) {
  const preRegisterSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'MEMBER']),
  });

  // Field Validation
  const validatedFields = preRegisterSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    role: formData.get('role'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to register User.',
    };
  }

  const { username, email, role } = validatedFields.data;

  // Check if user is already invited
  const userAlreadyInvited = await getInvitedUsersByUsername(username);
  if (userAlreadyInvited) {
    return {
      message: `${userAlreadyInvited.username} is already invited`,
    };
  }

  // Check if user already exist in the database
  const userAlreadyThere = await getUserByUsername(username);
  if (userAlreadyThere) {
    return {
      message: `Username ${userAlreadyThere.username} already taken`,
    };
  }

  const inv = await createInvitation({
    username: username,
    email: email,
    role: role,
  });

  // Kick off EMail...
  if (inv) {
    const status = await sendEmailRsvp(
      inv?.username,
      inv?.email,
      inv.invitationId,
    );
  } else
    return {
      message: `Err: On creating th invitation`,
    };

  revalidatePath('/');
}

export async function registerUser(prevState: any, formData: FormData) {
  const registerSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
  });

  // 1. Field Validation
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

  // 3.1 create a new Organization
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
  const orgLoggedIn = await getOrganizationLoggedIn();
  if (orgLoggedIn) {
    // Create new Scenario Entity:
    const scenarioEntiy = await createScenarioEntity({
      scenarioId: Number(scenarioId),
      orgId: orgLoggedIn.orgId,
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

      redirect(
        `/dashboard/${orgLoggedIn.orgId}/scenarios/${scenarioId}/logs/${scenarioEntiy.scenarioEntityId}`,
      );
    }
  } else
    return {
      errors: `Err: Organization ID missing.`,
    };
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
export async function deleteScenarioAction(prevState: any, formData: FormData) {
  if (formData.get('scenarioId')) {
    await deleteScenario({ scenarioId: Number(formData.get('scenarioId')) });
    // TODO: delete corresponding Scenario Items, Actions, Conditions, Events and Ter as well!
    revalidatePath('/');
  }
}

'use server';

import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSession } from '../../database/sessions';
import {
  createUser,
  getUserByUsername,
  getUserWithPasswordHashByUsername,
} from '../../database/users';
import { getSafeReturnToPath, secureCookieOptions } from './utils';

export async function registerUser(prevState: any, formData: FormData) {
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
      message: 'Missing Fields. Failed to register User.',
    };
  }

  const { username, password } = validatedFields.data;

  // 2. Check if user already exist in the database

  const userAlreadyThere = await getUserByUsername(username);
  if (userAlreadyThere) {
    return {
      message: `Username ${userAlreadyThere.username} already taken`,
    };
  }

  // 3. Hash the plain password from the user

  const passwordHash = await bcrypt.hash(password, 12);
  // 4. Save the user information with the hashed password in the database
  const newUser = await createUser(username, passwordHash);

  if (!newUser) {
    return {
      message: `Error creating the new user`,
    };
  }
  // 4. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // 5. Create the session record
  const session = await createSession(newUser.id, token);

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
  const userWithPasswordHash = await getUserWithPasswordHashByUsername(
    username,
  );

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

  // 5. Create the session record
  const session = await createSession(userWithPasswordHash.id, token);

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

  const x = getSafeReturnToPath(
    formData.get('returnTo')?.toString() || `/profile/${username}`,
  );
  if (x) {
    redirect(x);
  }

  //router.push(
  //   getSafeReturnToPath(props.returnTo) || `/profile/${data.user.username}`,
  // );

  // revalidatePath() throws unnecessary error, will be used when stable
  // revalidatePath('/(auth)/login', 'page');
  //router.refresh();
}

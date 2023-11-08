import { Route } from 'next';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getUserBySessionToken } from '../../database/users';
import { ScenarioEntityHistoryType } from '../../migrations/00017-createTablescenarioEntityHistory';

// nullish coalescing operator
export function getCookie(name: string) {
  return cookies().get(name)?.value;
}

export const secureCookieOptions = {
  httpOnly: true,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24, // Expires after 1 day/24 hours
  // Be explicit about new default behavior
  // in browsers
  // https://web.dev/samesite-cookies-explained/
  sameSite: 'lax', // this prevents CSRF attacks
} as const;

const returnToSchema = z.string().refine((value) => {
  return (
    !value.startsWith('/logout') &&
    // Regular expression for valid returnTo path:
    // - starts with a slash
    // - until the end of the string, 1 or more:
    //   - numbers
    //   - hash symbols
    //   - forward slashes
    //   - equals signs
    //   - question marks
    //   - lowercase letters
    //   - dashes
    /^\/[\d#/=?a-z-]+$/.test(value)
  );
});

export function getSafeReturnToPath(path: string | string[] | undefined) {
  const result = returnToSchema.safeParse(path);
  if (!result.success) return undefined;
  return result.data as Route;
}

export async function getUserLoggedIn() {
  // 1. Checking if the sessionToken cookie exists
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  return sessionToken && (await getUserBySessionToken(sessionToken.value));
}

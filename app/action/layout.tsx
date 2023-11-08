import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { getValidSessionByToken } from '../../database/sessions';
import SideBar from '../SideBar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // User has to be an admin
  // Get user from the database that meets the admin requirements

  // 3. Either redirect or render the login form
  if (!session) redirect(`/login?returnTo=${headers().get('x-pathname')}`);

  return <main>{children}</main>;
}

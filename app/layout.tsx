import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies, headers } from 'next/headers';
import { getValidSessionByToken } from '../database/sessions';
import { getUserBySessionToken } from '../database/users';
import LoginForm from './(auth)/login/LoginForm';
import SideBar from './SideBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flexible Approval',
  description: 'Approval Workflows made easy',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionTokenCookie = cookies().get('sessionToken');

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {!session ? (
          <LoginForm returnTo={headers().get('x-pathname') || '/'} />
        ) : (
          <>
            <SideBar />
            <main>{children}</main>
          </>
        )}
      </body>
    </html>
  );
}

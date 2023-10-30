import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { getUserBySessionToken } from '../database/users';
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
  // 1. Checking if the sessionToken cookie exists
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const user =
    sessionToken && (await getUserBySessionToken(sessionToken.value));

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {user?.username}
        <SideBar />
        <main>{children}</main>
      </body>
    </html>
  );
}

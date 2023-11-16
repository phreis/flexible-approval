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
  return <main>{children}</main>;
}

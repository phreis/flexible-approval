import { redirect } from 'next/navigation';
import {
  getOrganizationByUserName,
  getOrganizationLoggedIn,
} from '../../database/organizations';
import { getUserLoggedIn } from '../lib/utils';

export default async function LandingPage() {
  const organizationLoggedIn = await getOrganizationLoggedIn();
  redirect(`./dashboard/${organizationLoggedIn?.orgId}`);
  return <></>;
}

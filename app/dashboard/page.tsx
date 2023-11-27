import { redirect } from 'next/navigation';
import { getOrganizationLoggedIn } from '../../database/organizations';

export default async function LandingPage() {
  const organizationLoggedIn = await getOrganizationLoggedIn();
  redirect(`./dashboard/${organizationLoggedIn?.orgId}`);
}

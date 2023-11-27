import { redirect } from 'next/navigation';

type Props = {
  params: { organizationId: string };
  searchParams: { [key: string]: string | undefined };
};

export default function OrganizationPage({ params }: Props) {
  // until the OrganizationPage is implemented, we redirect to scenarios
  redirect(`/dashboard/${params.organizationId}/scenarios`);
}

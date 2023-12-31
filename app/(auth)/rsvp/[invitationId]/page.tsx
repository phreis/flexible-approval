import { Metadata } from 'next';
import React from 'react';
import { getInvitationById } from '../../../../database/invitations';
import RsvpForm from './RsvpForm';

export const metadata: Metadata = {
  title: 'Please set your password',
  description: 'Approval Workflows made easy',
};

type Props = {
  params: { invitationId: string };
  searchParams: { [key: string]: string | undefined };
};

export default async function RsvpPage(props: Props) {
  const invitation = await getInvitationById(props.params.invitationId);

  if (!invitation || invitation.inviteAccepted) {
    return <main>Err: no invitation found or no more valid</main>;
  } else {
    return (
      <main>
        <RsvpForm invitation={invitation} />
      </main>
    );
  }
}

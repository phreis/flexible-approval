import { LibraryResponse, SendEmailV3_1 } from 'node-mailjet';
import { User } from '../../migrations/00007-createTableUsers';
import { InvitationType } from '../../migrations/00018-createTableInvitations';
import { mailjet } from '../../services/mailjet/connect';

export async function sendEmail(data: any): Promise<any> {
  const result: any = await mailjet
    .post('send', { version: 'v3.1' })
    .request(data);
  return result.body.Messages[0];
  // console.log('Email send status: ', status);
}

export async function sendEmailRsvp(
  username: User['username'],
  mailTo: User['email'],
  invitationId: InvitationType['invitationId'],
): Promise<SendEmailV3_1.ResponseMessage[]> {
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: 'flexible-approval@philippreisinger.at',
        },
        To: [
          {
            Email: mailTo,
          },
        ],
        TemplateErrorReporting: {
          Email: 'flexible-approval@philippreisinger.at',
          Name: 'Reporter',
        },
        TemplateLanguage: true,
        Subject: 'Your flexible-approval invitation',
        HTMLPart: `        <h3>
          Hello, <strong>${username}</strong>!
        </h3><br>
        <p>You have been invited to join Flexible Approve!</p>
        <p>Please set your personal password here:</p>
        <a href='https://phreis-flexible-approval.fly.dev/rsvp/${invitationId}'/>Login<a>
        <br><br> Yours, <br> flexible-approval Team`,
        TextPart: `Hello, ${username}! You have been invited to join Flexible Approve! Please set your personal password here: https://phreis-flexible-approval.fly.dev/rsvp/${invitationId}`,
      },
    ],
  };
  return await sendEmail(data);
}

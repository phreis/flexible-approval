import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { SendEmailV3_1 } from 'node-mailjet';
import { getUserByUsername } from '../../database/users';
import { User } from '../../migrations/00007-createTableUsers';
import { ActionDefinitionType } from '../../migrations/00012-createTableActionDefinitions';
import { ScenarioEntityHistoryType } from '../../migrations/00017-createTablescenarioEntityHistory';
import { InvitationType } from '../../migrations/00018-createTableInvitations';
import { EventDefinitionType } from '../../migrations/00019-createTableEventDefinitions';
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
  const headersList = headers();
  const referer = headersList.get('referer');
  let link: string = '';
  if (referer) {
    const request = new NextRequest(referer);
    link = `${request.nextUrl.origin}/rsvp/${invitationId}`;
  }

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
        <a href='${link}'/>Login<a>
        <br><br> Yours, <br> flexible-approval Team`,
        TextPart: `Hello, ${username}! You have been invited to join Flexible Approve! Please set your personal password here: ${link}`,
      },
    ],
  };
  return await sendEmail(data);
}

export async function sendEmailAction(
  approver: ActionDefinitionType['approver'],
  textTemplate: ActionDefinitionType['textTemplate'],
  historyId: ScenarioEntityHistoryType['historyId'],
): Promise<SendEmailV3_1.ResponseMessage[] | undefined> {
  const user = await getUserByUsername(approver);

  if (user) {
    const headersList = headers();
    const referer = headersList.get('referer');
    let link: string = '';
    if (referer) {
      const request = new NextRequest(referer);
      link = `${request.nextUrl.origin}/action/${historyId}`;
    }

    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: 'flexible-approval@philippreisinger.at',
          },
          To: [
            {
              Email: user.email,
            },
          ],
          TemplateErrorReporting: {
            Email: 'flexible-approval@philippreisinger.at',
            Name: 'Reporter',
          },
          TemplateLanguage: true,
          Subject: 'flexible-approval: Please respond!',
          HTMLPart: `        <h3>
          Hello, <strong>${user.username}</strong>!
        </h3><br>
        <p>There is an approvement request with for following contrxt provided:</p>
        <p>${textTemplate}</p>
        <p>Please response to the flexible-approval Action using the link below:</p>
        <br>
        <a href='${link}'/>Response here<a>
        <br><br> Yours, <br> The flexible-approval Team`,
          TextPart: `Hello, ${user.username}! There is an approvement request with for following contrxt provided: ${textTemplate}  Please response to the flexible-approval Action using the link: ${link}`,
        },
      ],
    };
    return await sendEmail(data);
  }
}

export async function sendEmailEvent(
  mailTo: string,
  textTemplate: EventDefinitionType['textTemplate'],
): Promise<SendEmailV3_1.ResponseMessage[] | undefined> {
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
        Subject: 'flexible-approval: Information',
        HTMLPart: `        <h3>
          Hello!
        </h3><br>
        <p>There is an information for you from flexible-approval:</p>
        <p>${textTemplate}</p>

        <br><br> Yours, <br> The flexible-approval Team`,
        TextPart: `There is an information for you from flexible-approval: ${textTemplate}`,
      },
    ],
  };
  return await sendEmail(data);
}

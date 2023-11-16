import { LibraryResponse, SendEmailV3_1 } from 'node-mailjet';
import { mailjet } from '../../services/mailjet/connect';

const data: SendEmailV3_1.Body = {
  Messages: [
    {
      From: {
        Email: 'flexible-approval@philippreisinger.at',
      },
      To: [
        {
          Email: 'philippr01@yahoo.de',
        },
      ],
      TemplateErrorReporting: {
        Email: 'reporter@test.com',
        Name: 'Reporter',
      },
      TemplateLanguage: true,
      Subject: 'Your email flight plan!',
      HTMLPart:
        '<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!',
      TextPart:
        'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
    },
  ],
};

export async function sendEmail() {
  const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
    .post('send', { version: 'v3.1' })
    .request(data);
  const status = result.body.Messages[0];
  console.log('Email send status: ', status);
}

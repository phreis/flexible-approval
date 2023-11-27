import { Sql } from 'postgres';

export type InvitationType = {
  invitationId: string;
  orgId: number;
  email: string;
  username: string;
  role: string;
  inviteSent: Date;
  inviteAccepted: Date | null;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      invitations (
        invitation_id VARCHAR(36) NOT NULL,
        org_id INTEGER NOT NULL,
        username VARCHAR(80) NOT NULL UNIQUE,
        email VARCHAR(40) NOT NULL,
        role VARCHAR(10) NOT NULL,
        invite_sent TIMESTAMP NOT NULL DEFAULT NOW (),
        invite_accepted TIMESTAMP,
        PRIMARY KEY (
          invitation_id
        )
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE invitations `;
}

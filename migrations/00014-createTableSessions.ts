import { Sql } from 'postgres';
import { OrganizationType } from './00000-createTableOrganizations';

export type Session = {
  id: number;
  token: string;
  userId: number;
  orgId: OrganizationType['orgId'];
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      sessions (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        org_id INTEGER NOT NULL,
        token VARCHAR(150) NOT NULL UNIQUE,
        expiry_timestamp TIMESTAMP NOT NULL DEFAULT NOW () + INTERVAL '24 hours',
        user_id INTEGER NOT NULL,
        PRIMARY KEY (
          id,
          org_id
        ),
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE sessions `;
}

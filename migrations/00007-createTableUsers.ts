import { Sql } from 'postgres';

export type User = {
  id: number;
  username: string;
  orgId: number;
  email: string;
  role: string;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      users (
        id INTEGER GENERATED ALWAYS AS IDENTITY,
        username VARCHAR(80) NOT NULL UNIQUE,
        org_id INTEGER NOT NULL,
        email VARCHAR(40) NOT NULL,
        role VARCHAR(10) NOT NULL,
        password_hash VARCHAR(80) NOT NULL,
        PRIMARY KEY (id)
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE users `;
}

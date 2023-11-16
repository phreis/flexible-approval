import { Sql } from 'postgres';

export type OrganizationType = {
  orgId: number;
  name: string;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE
      organizations (
        org_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(80) NOT NULL,
        PRIMARY KEY (org_id)
      );
  `;
}

export async function down(sql: Sql) {
  await sql` DROP TABLE organizations `;
}

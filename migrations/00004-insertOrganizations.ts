import { Sql } from 'postgres';

// PW hugo1 1234
const organizations = [
  {
    name: 'My Organization',
  },
];

export async function up(sql: Sql) {
  for (const org of organizations) {
    await sql`
      INSERT INTO
        organizations (name)
      VALUES
        (
          ${org.name}
        )
    `;
  }
}

export async function down(sql: Sql) {
  for (const org of organizations) {
    await sql`
      DELETE FROM organizations
      WHERE
        name = ${org.name}
    `;
  }
}

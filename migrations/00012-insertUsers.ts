import { Sql } from 'postgres';

// PW hugo1 1234
const users = [
  {
    org_id: 1,
    username: 'hugo1',
    email: 'hugo1@example.com',
    role: 'admin',
    password_hash:
      '$2b$12$Fb3Wdc8IOb78BTC1HYQSAO012SjipC1dhOmDZC73FZt7pC2jfnJLu',
  },
];

export async function up(sql: Sql) {
  for (const item of users) {
    await sql`
      INSERT INTO
        users (
          org_id,
          username,
          email,
          role,
          password_hash
        )
      VALUES
        (
          ${item.org_id},
          ${item.username},
          ${item.email},
          ${item.role},
          ${item.password_hash}
        )
    `;
  }
}

export async function down(sql: Sql) {
  for (const item of users) {
    await sql`
      DELETE FROM users
      WHERE
        username = ${item.username}
    `;
  }
}

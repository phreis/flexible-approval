import { Sql } from 'postgres';

// PW hugo1 1234
const users = [
  {
    username: 'hugo1',
    password_hash:
      '$2b$12$Fb3Wdc8IOb78BTC1HYQSAO012SjipC1dhOmDZC73FZt7pC2jfnJLu',
  },
];

export async function up(sql: Sql) {
  for (const item of users) {
    await sql`
      INSERT INTO users
        (username, password_hash)
      VALUES
        (${item.username}, ${item.password_hash} )
  `;
  }
}

export async function down(sql: Sql) {
  for (const item of users) {
    await sql`
      DELETE FROM users WHERE username = ${item.username}
    `;
  }
}

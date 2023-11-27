export async function up() {
  /*   for (const header of conditionHeader) {
    await sql`
      INSERT INTO
        conditionheader (
          scenario_id,
          description
        )
      VALUES
        (
          ${header.scenarioId},
          ${header.description}
        )
    `;
  } */
}

export async function down() {
  /*   for (const header of conditionHeader) {
    await sql`
      DELETE FROM conditionheader
      WHERE
        condition_id = ${header.conditionId}
    `;
  } */
}

import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export async function insertMovies(uid: any, mid: any, id: any) {
  const result = sql<any>`
  UPDATE \`watch-list\`
SET mid = JSON_ARRAY_APPEND(
    COALESCE(mid, JSON_ARRAY()),
    '$',
    ${mid}
)
WHERE uid = ${uid} AND id = ${id}
  AND JSON_SEARCH(COALESCE(mid, JSON_ARRAY()), 'one', ${mid}) IS NULL;
    `.execute(db);
  return result;
}
export async function update(uid: any, id: any, name: any) {
  const result = sql<any>`
      UPDATE \`watch-list\`
      SET name = ${name},updated_at=CURRENT_TIMESTAMP
      WHERE id = ${id} AND uid = ${uid}
    `.execute(db);
  return result;
}
export async function removeMovie(mid: any, uid: any, id: any) {
  const result = sql<any>`  UPDATE \`watch-list\`
    SET mid = CASE
      WHEN JSON_SEARCH(mid, 'one', ${mid}) IS NOT NULL
      THEN JSON_SET(COALESCE(mid, '[]'), '$', JSON_REMOVE(mid, JSON_UNQUOTE(JSON_SEARCH(mid, 'one', ${mid}))))
      ELSE COALESCE(mid, '[]')
    END
    WHERE uid = ${uid} AND id=${id}`.execute(db);
  return result;
}

export async function remove(uid: any, id: any) {
  const result = db
    .deleteFrom("watch-list")
    .where("id", "=", id)
    .where("uid", "=", parseInt(`${uid}`))
    .execute();
  return result;
}
export async function share(id: any) {
  const result = await db
    .selectFrom("watch-list")
    .selectAll()
    .where("id", "=", parseInt(id))
    .executeTakeFirst();
  if (result) {
    const query = sql<any>`  UPDATE \`watch-list\`
      SET is_shared=1,updated_at=CURRENT_TIMESTAMP
      WHERE id=${id}`.execute(db);
    return result;
  }
}
export const insert = async (data: any): Promise<any> => {
  if (data.length == 0) {
    console.warn("No data provided for insertion.");
    return;
  }
  const result = await db
    .insertInto("watch-list")
    .values(data)
    .ignore()
    .execute();
};
export const access = async (uid: any): Promise<any> => {
  const list = await db
    .selectFrom("watch-list")
    .selectAll()
    .where("uid", "=", parseInt(`${uid}`))
    .execute();
  return list;
};

export async function checkWatchList(uid: any) {
  const list = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("uid", "=", parseInt(`${uid}`))
    .execute();
  return list;
}
export async function getMid(uid: any, id: any) {
  const list = await db
    .selectFrom("watch-list")
    .select("mid")
    .where("uid", "=", parseInt(`${uid}`))
    .where("id", "=", parseInt(`${id}`))
    .executeTakeFirst();
  return list;
}

import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
export async function insert(uid: any, mid: number) {
  const query = sql<any>`
    UPDATE users
    SET favorites = JSON_ARRAY_APPEND(
      COALESCE(favorites, JSON_ARRAY()),
      '$',
      ${mid}
    )
    WHERE id = ${uid}
    AND JSON_SEARCH(COALESCE(favorites, JSON_ARRAY()), 'one', ${mid}) IS NULL
  `.execute(db);

  return query;
}
export async function check(uid: any) {
  const list = await db
    .selectFrom("users")
    .select("favorites")
    .where("id", "=", parseInt(uid))
    .execute();
  return list;
}
export async function remove(mid: any, uid: any) {
  const result = sql<any>`
    UPDATE users
    SET favorites = CASE
      WHEN JSON_SEARCH(favorites, 'one', ${mid}) IS NOT NULL
      THEN JSON_SET(COALESCE(favorites, '[]'), '$', JSON_REMOVE(favorites, JSON_UNQUOTE(JSON_SEARCH(favorites, 'one', ${mid}))))
      ELSE COALESCE(favourites, '[]')
    END
    WHERE id = ${uid}
      `.execute(db);
  return result;
}

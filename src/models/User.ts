import { db } from "../db/database";
export const register = async (data: any[]): Promise<any> => {
  const user = await db.insertInto("users").values(data).execute();
  return user;
};
export const findUser = async (email: string): Promise<any> => {
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return user;
};
export const updateIsVerified = async (
  email: any,
  token: any
): Promise<any> => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      is_verified: 1,
    })
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return userUpdate;
};
export const updatePassword = async (
  email: any,
  password: any
): Promise<any> => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      password: password,
    })
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return userUpdate;
};

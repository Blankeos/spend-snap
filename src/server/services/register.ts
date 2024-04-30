import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { lucia } from "../lucia";
import { userTable } from "../schema/auth";

export async function registerService(params: {
  username: string;
  password: string;
}) {
  const { username, password } = params;
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    throw new Error("Invalid authentication. Check username or password.");
    // return fail(400, {
    //   message: "Invalid username",
    // });
  }
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    throw new Error("Invalid authentication. Check username or password.");
  }

  const userId = generateIdFromEntropySize(10); // 16 characters long
  const passwordHash = await hash(password, {
    // recommended minimum parameters
    /** @ts-ignore */
    memorySize: 19456,
    iterations: 2,
    tagLength: 32,
    parallelism: 1,
  });

  const existingUsername = await db.query.userTable.findFirst({
    where: (users) => eq(users.username, username),
  });

  if (existingUsername) {
    throw Error(`Username ${username} already exists.`);
  }

  const createdUser = await db.insert(userTable).values({
    id: userId,
    username: username,
    passwordHash: passwordHash,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  return {
    sessionCookie,
    session,
    createdUser,
  };
}

import { authDAO } from "@/server/dao/auth.dao";
import { hash } from "@node-rs/argon2";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.development");

const main = async () => {
  if (process.env.NODE_ENV === "production") return; // Never seed on production 😭

  console.log("🌱 Seed start"); // Break this apart into different files if needed in the future.

  // --- 1. Create Users
  const password1Hash = await hash("carlo123", {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const password2Hash = await hash("andrea123", {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  authDAO.user.createFromUsernameAndPassword("carlo", password1Hash);
  authDAO.user.createFromUsernameAndPassword("andrea", password2Hash);

  // --- 2. Create Collations

  console.log("🌴 Seed done");
};

main();

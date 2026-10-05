import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("Authenticated Clerk user has no email address");
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  return db.user.upsert({
    where: {
      clerkUserId: user.id,
    },
    update: {},
    create: {
      clerkUserId: user.id,
      name,
      imageUrl: user.imageUrl,
      email,
    },
  });
};
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";
import { checkUser } from "@/lib/checkUser";



export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry);

           industryInsight = await tx.industryInsight.create({
      data: {
         industry: data.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
    });
       
        
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [],
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 30000, // increased timeout for AI generation
      }
    );

    
    return {success: true, ...result};
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile" + error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
    },
  });

  if (user) {
    return { isOnboarded: Boolean(user.industry) };
  }

  const provisionedUser = await checkUser();
  if (!provisionedUser || provisionedUser.clerkUserId !== userId) {
    throw new Error("User not found");
  }

  return { isOnboarded: Boolean(provisionedUser.industry) };
}
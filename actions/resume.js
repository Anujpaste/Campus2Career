"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.findUnique({
    where: { userId: user.id },
  });

  return resume;
}

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  // Upsert resume (create or update)
  const resume = await db.resume.upsert({
    where: { userId: user.id },
    update: { content },
    create: {
      userId: user.id,
      content,
    },
  });

  return resume;
}

export async function improveWithAI({ current, type }) {
  const prompt = `You are a professional resume writer. Improve the following ${type} description to be more impactful, professional, and achievement-focused. 
  
Focus on:
- Using strong action verbs
- Quantifying achievements where possible
- Making it more specific and concrete
- Improving readability and flow
- Adding value proposition

Current description:
"${current}"

Return ONLY the improved description, no explanations or additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const improvedText = response.text().trim();

  return improvedText;
}

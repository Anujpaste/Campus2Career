import { z } from "zod";

// Onboarding schema
export const onboardingSchema = z.object({
  industry: z.string().min(1, "Industry is required"),
  subIndustry: z.string().min(1, "Specialization is required"),
  experience: z.string().min(1, "Experience is required").transform((val) => {
    const num = Number(val);
    if (isNaN(num) || num < 0 || num > 50) {
      throw new Error("Experience must be a number between 0 and 50");
    }
    return num;
  }),
  skills: z.string().min(1, "Skills are required"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio cannot exceed 500 characters"),
});

// Resume schemas
export const entrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  current: z.boolean().default(false),
});

export const resumeSchema = z.object({
  contactInfo: z.object({
    email: z.string().email().optional().or(z.literal("")),
    mobile: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
  }),
  summary: z.string().optional(),
  skills: z.string().optional(),
  experience: z.array(entrySchema).default([]),
  education: z.array(entrySchema).default([]),
  projects: z.array(entrySchema).default([]),
});

// Cover Letter schema
export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
});
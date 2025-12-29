import { z } from "zod";

export const UserProfileSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string(),
  html_url: z.string(),
  bio: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
});

export const RepoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  language: z.string().nullable(),
  html_url: z.string(),
  fork: z.boolean(),
});

export const LanguageStatsSchema = z.record(z.string(), z.number());

export const WrappedDataSchema = z.object({
  profile: UserProfileSchema,
  repos: z.array(RepoSchema),
  topLanguages: z.array(
    z.object({ name: z.string(), count: z.number(), percentage: z.number() })
  ),
  totalStars: z.number(),
  totalCommits: z.number(), // Estimated
  longestStreak: z.number(),
  mostProductiveMonth: z.object({ name: z.string(), count: z.number() }),
  universalRank: z.string(), // "Top 1%", etc.
  busiestDay: z.string(), // "Monday", etc.
  busiestTime: z.string(), // "Morning", "Night", etc.
  year: z.number(),
});

export type WrappedData = z.infer<typeof WrappedDataSchema>;

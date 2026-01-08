import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { useMemo } from "react";
import { intervalToDuration ,formatDuration} from "date-fns";

// using this very very cool lobrary which can directly insert into prisma 


const FREE_POINTS = 5;
const PRO_POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
const GENERATION_COST = 1;

export async function getUsageTracker() {   
    const { has } = await auth();
    const hasProAccess = has({plan:"pro"});

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "usage",
    points: hasProAccess ? PRO_POINTS:FREE_POINTS,
    duration: DURATION,
  });

  return usageTracker;
}
export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);
  return result;
};

export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
};      


import { db } from '../lib/prisma.js';

const insights = await db.industryInsight.findMany({ select: { industry: true, lastUpdated: true } });
console.log('industryInsight count:', insights.length);
for (const i of insights) console.log(i);

process.exit(0);

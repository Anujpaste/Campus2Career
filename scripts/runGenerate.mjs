import { generateIndustryInsights } from '../lib/inngest/functions.js';

console.log('generateIndustryInsights keys:', Object.keys(generateIndustryInsights || {}));

const step = {
  run: async (name, fn) => {
    console.log('step.run:', name);
    return await fn();
  },
  ai: {
    wrap: async (provider, fn, prompt) => {
      console.log('step.ai.wrap:', provider);
      return await fn(prompt);
    },
  },
};

try {
  console.log('Invoking function handler...');
  // generateIndustryInsights.fn is the underlying handler created by inngest
  if (generateIndustryInsights && typeof generateIndustryInsights.fn === 'function') {
    await generateIndustryInsights.fn({ step });
    console.log('Handler completed.');
  } else {
    console.error('Handler function not available on generateIndustryInsights');
  }
} catch (err) {
  console.error('Error invoking handler:', err);
}

process.exit(0);

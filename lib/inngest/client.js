import { Inngest } from "inngest";

// Create a client to send and receive events.
// Read app id/name from environment when available so it can be configured
// from the Inngest dashboard without changing code.
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_ID || "campus2career",
  name: process.env.INNGEST_APP_NAME || "Campus2Career",
});

// Log the app id (non-secret) to help diagnose registration issues with
// the Inngest server. Avoid logging any secrets or API keys.
console.log('Inngest client initialized with app id:', process.env.INNGEST_APP_ID || 'campus2career');
 
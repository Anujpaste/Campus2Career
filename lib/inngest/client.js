import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "campus2career", name:"Campus2Career",
      id: "campus2career", // Unique app ID
  name: "Campus2Career",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
 
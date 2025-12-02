import { AiMemoryStore } from "@oof2510/llmjs";
import config from "../config.json";

export const aiMemory = new AiMemoryStore({
  uri: config.mongodb.url,
  dbName: config.mongodb.database,
  collectionName: "ai_memory",
});

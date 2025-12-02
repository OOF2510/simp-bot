const { AiMemoryStore } = require('@oof2510/llmjs');
const config = require('../config.json');

export const aiMemory = new AiMemoryStore({
  uri: config.mongodb.url,
  dbName: config.mongodb.database,
  collectionName: 'ai_memory'
});
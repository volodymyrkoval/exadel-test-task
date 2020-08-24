module.exports = {
  app: {
    port: process.env.PORT,
  },
  tmdb: {
    baseURL: process.env.TMDB_BASE_URL,
    apiVersion: process.env.TMDB_API_VERSIOM,
    apiKey: process.env.TMDB_API_KEY,
    numberOfReturnedEpisodes: Number(process.env.TMDB_NUMBER_OF_RETURNED_EPISODES),
  },
  analytics: {
    numberOfReturnedRecords: Number(process.env.ANALYTICS_NUMBER_OF_RETURNED_RECORDS),
  },
  mongo: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
    db: process.env.MONGODB_DB,
    collection: process.env.MONGODB_COLLECTION,
  },
  memcached: {
    host: process.env.MEMCACHED_HOST,
    port: process.env.MEMCACHED_PORT,
    ttl: Number(process.env.MEMCACHED_TTL),
  },
};

module.exports = {
  app: {
    port: process.env.PORT,
  },
  tmdb: {
    baseURL: 'test.url',
    apiVersion: 3,
    apiKey: 'test_api_key',
    numberOfReturnedEpisodes: 2,
  },
  analytics: {
    numberOfReturnedRecords: 2,
  },
  mongo: {
    host: 'mongo',
    port: '27017',
    user: 'user',
    pass: 'pass',
    db: 'analytics',
    collection: 'series_access',
  },
  memcached: {
    host: process.env.MEMCACHED_HOST,
    port: process.env.MEMCACHED_PORT,
    ttl: Number(process.env.MEMCACHED_TTL),
  },
};

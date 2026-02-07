import NodeCache from 'node-cache';

const analyticsCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const cache = {
  get: (key) => analyticsCache.get(key),
  set: (key, value, ttl) => analyticsCache.set(key, value, ttl),
  del: (key) => analyticsCache.del(key),
  flush: () => analyticsCache.flushAll(),
};

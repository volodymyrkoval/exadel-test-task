/* eslint-disable no-param-reassign */
import MemcachedCacheClient from '../../services/cache/memcachedCacheClient';

function WithCache(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function cacheWrapper(...args) {
    const cacheName = `${target.constructor.name}-${propertyKey}-${args.join(',')}`;

    const cachedData = await MemcachedCacheClient.getInstance().get(cacheName).then(JSON.parse);

    if (cachedData) return cachedData;

    const result = await originalMethod.apply(this, args);

    await MemcachedCacheClient.getInstance().set(cacheName, JSON.stringify(result));

    return result;
  };
}

export default WithCache;

import Memcached from 'memcached';
import CacheClient from '../../types/cache/cacheClient.interface';

const config = require('config');

export default class MemcachedCacheClient implements CacheClient {
  private host: string = config.get('memcached.host');

  private port: string = config.get('memcached.port');

  private ttl: number = config.get('memcached.ttl');

  client = new Memcached(`${this.host}:${this.port}`);

  static instance: MemcachedCacheClient;

  static getInstance() {
    if (!MemcachedCacheClient.instance) {
      MemcachedCacheClient.instance = new MemcachedCacheClient();
    }

    return MemcachedCacheClient.instance;
  }

  set(name: string, value: string): Promise<null> {
    return new Promise((resolve, reject) => this.client.set(name, value, this.ttl, (err) => {
      if (err) return reject(err);
      return resolve(null);
    }));
  }

  get(name: string): Promise<string> {
    return new Promise((resolve, reject) => this.client.get(name, (err, data) => {
      if (err) return reject(err);
      return resolve(data || null);
    }));
  }
}

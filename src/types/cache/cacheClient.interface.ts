export default interface CacheClient {
  set(name: string, value: string)
  get(name: string): object;
}

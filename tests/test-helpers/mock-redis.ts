/**
 * Mock Redis Client
 * 
 * Implementación completa de mock Redis para tests
 */

export class MockRedisClient {
  private store = new Map<string, string>();
  private sorted = new Map<string, Array<{ score: number; member: string }>>();
  private lists = new Map<string, string[]>();
  private expiry = new Map<string, number>();

  // String operations
  async get(key: string): Promise<string | null> {
    this._checkExpiry(key);
    return this.store.get(key) || null;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    this.store.set(key, value);
    
    if (mode === 'EX' && duration) {
      this.expiry.set(key, Date.now() + duration * 1000);
    }
    
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<string> {
    this.store.set(key, value);
    this.expiry.set(key, Date.now() + seconds * 1000);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.store.delete(key)) count++;
      this.sorted.delete(key);
      this.lists.delete(key);
      this.expiry.delete(key);
    }
    return count;
  }

  async exists(...keys: string[]): Promise<number> {
    return keys.filter(key => {
      this._checkExpiry(key);
      return this.store.has(key) || this.sorted.has(key) || this.lists.has(key);
    }).length;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.store.has(key) && !this.sorted.has(key) && !this.lists.has(key)) {
      return 0;
    }
    this.expiry.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const expiryTime = this.expiry.get(key);
    if (!expiryTime) return -1;
    
    const remaining = Math.ceil((expiryTime - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  // Number operations
  async incr(key: string): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current + 1;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  async incrby(key: string, increment: number): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current + increment;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  async decr(key: string): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current - 1;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  async decrby(key: string, decrement: number): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current - decrement;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  // List operations
  async lpush(key: string, ...values: string[]): Promise<number> {
    if (!this.lists.has(key)) {
      this.lists.set(key, []);
    }
    const list = this.lists.get(key)!;
    list.unshift(...values);
    return list.length;
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    if (!this.lists.has(key)) {
      this.lists.set(key, []);
    }
    const list = this.lists.get(key)!;
    list.push(...values);
    return list.length;
  }

  async lpop(key: string): Promise<string | null> {
    const list = this.lists.get(key);
    if (!list || list.length === 0) return null;
    return list.shift() || null;
  }

  async rpop(key: string): Promise<string | null> {
    const list = this.lists.get(key);
    if (!list || list.length === 0) return null;
    return list.pop() || null;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const list = this.lists.get(key) || [];
    const end = stop === -1 ? undefined : stop + 1;
    return list.slice(start, end);
  }

  async llen(key: string): Promise<number> {
    return (this.lists.get(key) || []).length;
  }

  // Sorted set operations
  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.sorted.has(key)) {
      this.sorted.set(key, []);
    }
    const set = this.sorted.get(key)!;
    
    // Remove existing member
    const existingIndex = set.findIndex(s => s.member === member);
    if (existingIndex !== -1) {
      set.splice(existingIndex, 1);
    }
    
    set.push({ score, member });
    set.sort((a, b) => a.score - b.score);
    return 1;
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    const set = this.sorted.get(key) || [];
    const end = stop === -1 ? undefined : stop + 1;
    return set.slice(start, end).map(s => s.member);
  }

  async zrangebyscore(key: string, min: number, max: number): Promise<string[]> {
    const set = this.sorted.get(key) || [];
    return set
      .filter(s => s.score >= min && s.score <= max)
      .map(s => s.member);
  }

  async zrem(key: string, member: string): Promise<number> {
    const set = this.sorted.get(key);
    if (!set) return 0;
    
    const index = set.findIndex(s => s.member === member);
    if (index === -1) return 0;
    
    set.splice(index, 1);
    return 1;
  }

  async zcard(key: string): Promise<number> {
    return (this.sorted.get(key) || []).length;
  }

  async zscore(key: string, member: string): Promise<string | null> {
    const set = this.sorted.get(key) || [];
    const item = set.find(s => s.member === member);
    return item ? item.score.toString() : null;
  }

  // Key operations
  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const allKeys = [
      ...this.store.keys(),
      ...this.sorted.keys(),
      ...this.lists.keys(),
    ];
    
    return allKeys.filter(key => {
      this._checkExpiry(key);
      return regex.test(key);
    });
  }

  async scan(cursor: number, match?: string, count?: number): Promise<[string, string[]]> {
    const allKeys = await this.keys(match || '*');
    const pageSize = count || 10;
    const start = cursor;
    const end = start + pageSize;
    const keys = allKeys.slice(start, end);
    const nextCursor = end < allKeys.length ? end.toString() : '0';
    
    return [nextCursor, keys];
  }

  // Pipeline support
  pipeline() {
    const commands: Array<() => Promise<any>> = [];
    
    const pipelineProxy = {
      incr: (key: string) => {
        commands.push(() => this.incr(key));
        return pipelineProxy;
      },
      set: (key: string, value: string) => {
        commands.push(() => this.set(key, value));
        return pipelineProxy;
      },
      zadd: (key: string, score: number, member: string) => {
        commands.push(() => this.zadd(key, score, member));
        return pipelineProxy;
      },
      lpush: (key: string, ...values: string[]) => {
        commands.push(() => this.lpush(key, ...values));
        return pipelineProxy;
      },
      expire: (key: string, seconds: number) => {
        commands.push(() => this.expire(key, seconds));
        return pipelineProxy;
      },
      exec: async () => {
        return Promise.all(commands.map(cmd => cmd()));
      },
    };

    return pipelineProxy;
  }

  // Connection methods
  async quit(): Promise<string> {
    return 'OK';
  }

  disconnect() {
    // No-op
  }

  async flushall(): Promise<string> {
    this.store.clear();
    this.sorted.clear();
    this.lists.clear();
    this.expiry.clear();
    return 'OK';
  }

  async flushdb(): Promise<string> {
    return this.flushall();
  }

  // Private helpers
  private _checkExpiry(key: string) {
    const expiryTime = this.expiry.get(key);
    if (expiryTime && Date.now() >= expiryTime) {
      this.store.delete(key);
      this.sorted.delete(key);
      this.lists.delete(key);
      this.expiry.delete(key);
    }
  }
}

/**
 * Create mock Redis client
 */
export function createMockRedisClient() {
  return new MockRedisClient();
}

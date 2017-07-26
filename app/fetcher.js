import { QueryResponseCache } from 'relay-runtime';

// TODO: Update this when someone releases a real, production-quality solution
// for handling universal rendering with Relay Modern. For now, this is just
// enough to get things working.

const CACHE_SIZE = 100;
const TTL = 60 * 1000;

export default class Fetcher {
  constructor(url, initialCache) {
    this.url = url;
    this.cache = new QueryResponseCache({ size: CACHE_SIZE, ttl: TTL });
    if (initialCache) {
      // eslint-disable-next-line no-underscore-dangle
      this.cache._responses = new Map(initialCache);
    }
  }

  async fetch(operation, variables) {
    const cachedPayload = this.cache.get(operation.name, variables);
    if (cachedPayload) {
      return cachedPayload;
    }

    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: operation.text, variables }),
    });

    const payload = await response.json();
    this.cache.set(operation.name, variables, payload);
    return payload;
  }

  toJSON() {
    // eslint-disable-next-line no-underscore-dangle
    return [...this.cache._responses];
  }
}

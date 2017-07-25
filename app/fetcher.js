import { QueryResponseCache } from 'relay-runtime';

// TODO: Update this when someone releases a real, production-quality solution
// for handling universal rendering with Relay Modern. For now, this is just
// enough to get things working.

const CACHE_SIZE = 100;
const TTL = 60 * 1000;

class FetcherBase {
  constructor(url) {
    this.url = url;
  }

  async fetch(operation, variables) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: operation.text, variables }),
    });
    return response.json();
  }
}

export class ClientFetcher extends FetcherBase {
  constructor(url) {
    super(url);

    this.cache = new QueryResponseCache({ size: CACHE_SIZE, ttl: TTL });
  }

  async fetch(operation, variables) {
    const cachedPayload = this.cache.get(operation.name, variables);
    if (cachedPayload) {
      return cachedPayload;
    }

    const payload = await super.fetch(operation, variables);
    this.cache.set(operation.name, variables, payload);
    return payload;
  }
}

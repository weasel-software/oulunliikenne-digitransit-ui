// eslint-disable-next-line
export class MockTileLayers {
  constructor() {
    const timestamp = Date.now() / 1000;
    this.features = [
      {
        properties: {
          timestamp,
          jobId: 0,
          hash: 'AAA',
        },
      },
      {
        properties: {
          id: '64396336:1603557297',
          timestamp,
          jobId: 1369,
          hash: 'AAA',
        },
      },
      {
        properties: {
          timestamp,
          jobId: 0,
          hash: 'BBB',
        },
      },
      {
        properties: {
          id: '64396333:1603557132',
          timestamp,
          jobId: 1370,
          hash: 'CCC',
        },
      },
      {
        properties: {
          timestamp,
          jobId: 0,
          hash: 'CCC',
        },
      },
      {
        properties: {
          id: '64396329:1603557080',
          timestamp,
          jobId: 99901,
          hash: 'BBB',
        },
      },
      {
        properties: {
          timestamp,
          jobId: 0,
          hash: 'DDD',
        },
      },
      {
        properties: {
          id: '64396329:1603557080',
          timestamp,
          jobId: 99902,
          hash: 'DDD',
        },
      },
    ];
  }

  get length() {
    return this.features.length;
  }
  feature(index) {
    return this.features[index];
  }
}

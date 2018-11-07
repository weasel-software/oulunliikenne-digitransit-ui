import configMerger from '../util/configMerger';

const CONFIG = 'oulu';
const APP_DESCRIPTION = 'Oulun seudun uusi reittiopas';
const APP_TITLE = 'Reittiopas';

const OTP_URL =
  process.env.OTP_URL ||
  'https://34i4d4eq8g.execute-api.eu-central-1.amazonaws.com/dev';
const API_URL = process.env.API_URL || 'https://dev-api.digitransit.fi';
const MAP_URL =
  process.env.MAP_URL || 'https://digitransit-dev-cdn-origin.azureedge.net';

const walttiConfig = require('./waltti').default;

export default configMerger(walttiConfig, {
  CONFIG,

  AWS: {
    region: 'eu-central-1',
    iot: {
      cognito: {
        identityPoolId: 'TODO',
      },
    },
  },

  URL: {
    API_URL,
    MAP_URL,
    OTP: OTP_URL,
    MQTT: 'TODO.iot.eu-central-1.amazonaws.com',
    STOP_MAP: `${MAP_URL}/map/v1/waltti-stop-map/`,
    CITYBIKE_MAP: `${MAP_URL}/map/v1/waltti-citybike-map/`,
    PARKING_STATIONS_MAP:
      'https://zokovzbuuk.execute-api.eu-central-1.amazonaws.com/dev/vtpbf/',
    CAMERASTATIONS_MAP:
      'https://qp3yfqwir6.execute-api.eu-central-1.amazonaws.com/dev/vtpbf/',
    ROADWORKS_MAP:
      'https://83q6jsdp5f.execute-api.eu-central-1.amazonaws.com/dev/vtpbf/',
    DISORDERS_MAP:
      'https://7ss2ymr8jf.execute-api.eu-central-1.amazonaws.com/dev/vtpbf/',
  },

  parkingStations: {
    showParkingStations: false,
    parkingStationsMinZoom: 12,
    smallIconMinZoom: 14,
    availabilityThreshold: 0.25,
  },

  cameraStations: {
    showCameraStations: false,
    cameraStationsMinZoom: 12,
  },

  roadworks: {
    showRoadworks: false,
    roadworksMinZoom: 12,
  },

  disorders: {
    showDisorders: false,
    disordersMinZoom: 12,
    showLines: false,
  },

  feedIds: ['OULU'],

  sprites: 'svg-sprite.oulu.svg',

  defaultMapCenter: {
    lat: 65.01236,
    lon: 25.46816,
  },

  navbarSettings: {
    disruptions: false,
    roadworks: false,
    parking: false,
    cameras: false,
  },

  appBarLinks: false,
  /* appBarLinks: {
    fi: {
      text: 'Suomeksi lorem ipsum dolor sit amet, tristique mollis nec vitae lorem aenean, in maecenas lobortis volutpat ac vel cursus.',
      links: [
        { name: 'Oulun joukkoliikenne', href: 'https://www.oulunjoukkoliikenne.fi/' },
        { name: 'Lentoliikenne (Finavia)', href: 'https://www.finavia.fi/fi' },
      ],
    },
    sv: {
      text: 'På svenska lorem ipsum dolor sit amet, tristique mollis nec vitae lorem aenean, in maecenas lobortis volutpat ac vel cursus.',
      links: [
        { name: 'Uleåborgs kollektivtrafik', href: 'https://www.oulunjoukkoliikenne.fi/english' },
        { name: 'Flygtrafik (Finavia)', href: 'https://www.finavia.fi/sv' },
      ],
    },
    en: {
      text: 'In English lorem ipsum dolor sit amet, tristique mollis nec vitae lorem aenean, in maecenas lobortis volutpat ac vel cursus.',
      links: [
        { name: 'Oulu public transport', href: 'https://www.oulunjoukkoliikenne.fi/english' },
        { name: 'Air service (Finavia)', href: 'https://www.finavia.fi/en' },
      ],
    },
  }, */

  appBarDisruptionInfo: false,

  // appBarLink: false,
  appBarLink: {
    name: 'wp.oulunliikenne.fi',
    href: 'https://wp.oulunliikenne.fi',
  },

  colors: {
    primary: '#e10069',
  },

  socialMedia: {
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    twitter: {
      site: '@oulunkaupunki',
    },
  },

  title: APP_TITLE,

  availableLanguages: ['fi', 'sv', 'en'],
  defaultLanguage: 'fi',

  availableModes: ['transport', 'walk', 'bicycle', 'car'],
  defaultMode: 'transport',

  // Navbar logo
  logo: 'oulu/oulu-logo.png',

  searchParams: {
    'boundary.rect.min_lat': 64.71,
    'boundary.rect.max_lat': 65.38,
    'boundary.rect.min_lon': 24.37,
    'boundary.rect.max_lon': 26.61,
  },

  areaPolygon: [[24.37, 64.71], [24.37, 65.38], [26.61, 65.38], [26.61, 64.71]],

  defaultEndpoint: {
    address: 'Keskusta',
    lat: 65.0118,
    lon: 25.4702,
  },

  defaultSettings: {
    walkBoardCost: 900,
  },

  defaultOrigins: [
    {
      icon: 'icon-icon_bus',
      label: 'Rotuaari, Oulu',
      lat: 65.012338,
      lon: 25.471333,
    },
    {
      icon: 'icon-icon_rail',
      label: 'Rautatieasema, Oulu',
      lat: 65.01014,
      lon: 25.483349,
    },
    {
      icon: 'icon-icon_airplane',
      label: 'Lentoasema, Oulu',
      lat: 64.928808,
      lon: 25.373296,
    },
  ],

  footer: {
    content: [
      { label: `© Oulu ${walttiConfig.YEAR}` },
      {},
      {
        name: 'footer-feedback',
        nameEn: 'Submit feedback',
        href: 'http://www.oulunjoukkoliikenne.fi/palautteet',
        icon: 'icon-icon_speech-bubble',
      },
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/tietoja-palvelusta',
        icon: 'icon-icon_info',
      },
    ],
  },

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Tämän palvelun tarjoaa Oulun joukkoliikenne joukkoliikenteen reittisuunnittelua varten Oulun, Iin, Kempeleen, Limingan, Lumijoen, Muhoksen ja Tyrnävän alueella. Palvelu kattaa joukkoliikenteen, kävelyn, pyöräilyn ja yksityisautoilun rajatuilta osin. Palvelu perustuu Digitransit palvelualustaan.',
        ],
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Den här tjänsten erbjuds av Oulun joukkoliikenne för reseplanering inom Oulu, Ii, Kempele, Liminka, Lumijoki, Muhos och Tyrnävä region. Reseplaneraren täcker med vissa begränsningar kollektivtrafik, promenad, cykling samt privatbilism. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'This service is provided by Oulun joukkoliikenne for route planning in Oulu, Ii, Kempele, Liminka, Lumijoki, Muhos and Tyrnävä region. The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
    ],
  },
});

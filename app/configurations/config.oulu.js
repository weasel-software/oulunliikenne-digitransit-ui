import configMerger from '../util/configMerger';

const CONFIG = 'oulu';
const APP_DESCRIPTION = 'Oulun seudun uusi reittiopas';
const APP_TITLE = 'Oulun liikenteen reittiopas';

const AWS_REGION = process.env.AWS_REGION || 'eu-central-1';

const OTP_URL = process.env.OTP_URL || 'https://api-dev.oulunliikenne.fi/proxy';
const API_URL = process.env.API_URL || 'https://dev-api.digitransit.fi';
const MAP_URL =
  process.env.MAP_URL || 'https://digitransit-dev-cdn-origin.azureedge.net';
const AWS_MAP_URL =
  process.env.AWS_MAP_URL || 'https://d2lk9qao4tzpwi.cloudfront.net';
const MQTT_URL =
  process.env.MQTT_URL || 'angqxp7s7wkrp-ats.iot.eu-central-1.amazonaws.com';
const AWS_IDENTITY_POOL_ID =
  process.env.AWS_IDENTITY_POOL_ID ||
  'eu-central-1:8f58773b-4d45-46bc-9534-5a9a0d19c76d';

const walttiConfig = require('./waltti').default;

export default configMerger(walttiConfig, {
  CONFIG,

  AWS: {
    region: AWS_REGION,
    iot: {
      identityPoolId: AWS_IDENTITY_POOL_ID,
    },
  },

  URL: {
    API_URL,
    MAP_URL,
    OTP: OTP_URL,
    MQTT: MQTT_URL,
    STOP_MAP: `${MAP_URL}/map/v1/waltti-stop-map/`,
    CITYBIKE_MAP: `${MAP_URL}/map/v1/waltti-citybike-map/`,
    PARKING_STATIONS_MAP: `${AWS_MAP_URL}/map/carparks/`,
    CAMERASTATIONS_MAP: `${AWS_MAP_URL}/map/cameras/`,
    ROADWORKS_MAP: `${AWS_MAP_URL}/map/roadworks/`,
    DISORDERS_MAP: `${AWS_MAP_URL}/map/disruptions/`,
    WEATHER_STATIONS_MAP: `${AWS_MAP_URL}/map/weatherstations/`,
    TMS_STATIONS_MAP: `${AWS_MAP_URL}/map/tmsstations/`,
    ROAD_CONDITIONS_MAP: `${AWS_MAP_URL}/map/roadconditions/`,
  },

  map: {
    mobileDefaultExpanded: true,
  },

  useAltRelatimeClient: true,
  routePrefix: 'OULU',

  tmsStations: {
    showTmsStations: true,
    tmsStationsMinZoom: 13,
  },

  weatherStations: {
    showWeatherStations: true,
    weatherStationsMinZoom: 13,
  },

  parkingStations: {
    showParkingStations: true,
    parkingStationsMinZoom: 13,
    smallIconMinZoom: 14,
    availabilityThreshold: 0.25,
  },

  cameraStations: {
    showCameraStations: true,
    cameraStationsMinZoom: 13,
  },

  roadworks: {
    showRoadworks: true,
    roadworksMinZoom: 11,
    showIcons: true,
    showLines: false,
  },

  disorders: {
    showDisorders: true,
    disordersMinZoom: 13,
    showLines: false,
  },

  roadConditions: {
    showRoadConditions: true,
    roadConditionsMinZoom: 7,
    showIcons: false,
    showLines: true,
    colors: {
      NORMAL_CONDITION: '#28A745',
      POOR_CONDITION: '#FFC107',
      EXTREMELY_POOR_CONDITION: '#DC3545',
      DEFAULT: '#999999',
    },
  },

  feedIds: ['OULU'],

  sprites: 'svg-sprite.oulu.svg',

  defaultMapCenter: {
    lat: 65.01236,
    lon: 25.46816,
  },

  appBarExternalModes: true,

  appBarLinks: true,

  appBarDisruptionInfo: true,

  appBarLink: false,
  /* appBarLink: {
    name: 'wp.oulunliikenne.fi',
    href: 'https://wp.oulunliikenne.fi',
  }, */

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

  toggleableSearch: true,
  toggleableFavourites: true,

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

  mapTrackingButtons: {
    altPosition: true,
    altPositionMobile: false,
    layers: {
      containerClassName: 'bubble-dialog-component-container-alt',
      headerId: 'motorist',
      icon: 'settings',
      buttonText: 'settings',
    },
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

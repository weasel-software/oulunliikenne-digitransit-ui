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
    CITYBIKE_MAP: `${AWS_MAP_URL}/map/bicyclestations/`,
    PARKING_STATIONS_MAP: `${AWS_MAP_URL}/map/carparks/`,
    CAMERASTATIONS_MAP: `${AWS_MAP_URL}/map/cameras/`,
    ROADWORKS_MAP: `${AWS_MAP_URL}/map/roadworks/`,
    DISORDERS_MAP: `${AWS_MAP_URL}/map/disruptions/`,
    WEATHER_STATIONS_MAP: `${AWS_MAP_URL}/map/weatherstations/`,
    TMS_STATIONS_MAP: `${AWS_MAP_URL}/map/tmsstations/`,
    ROAD_CONDITIONS_MAP: `${AWS_MAP_URL}/map/roadconditions/`,
    FLUENCY_MAP: `${AWS_MAP_URL}/map/fluency/`,
    ECO_COUNTERS_MAP: `${AWS_MAP_URL}/map/ecocounters/`,
    MAINTENANCE_VEHICLE_NON_MOTORISED_MAP: `${AWS_MAP_URL}/map/maintenanceroutesnonmotorised/`,
    MAINTENANCE_VEHICLE_MOTORISED_MAP: `${AWS_MAP_URL}/map/maintenanceroutesmotorised/`,
  },

  map: {
    mobileDefaultExpanded: true,
  },

  useAltRealtimeClient: true,
  routePrefix: 'OULU',

  stopsMinZoom: 11,
  stopsShowRealtimeTracking: true,
  stopsShowRealtimeTrackingDefault: true,
  stopsRealtimeTrackingLimit: 30,

  tmsStations: {
    showTmsStations: true,
    tmsStationsMinZoom: 11,
  },

  weatherStations: {
    showWeatherStations: true,
    weatherStationsMinZoom: 11,
  },

  parkingStations: {
    showParkingStations: true,
    parkingStationsMinZoom: 11,
    smallIconMinZoom: 13,
    availabilityThreshold: 0.25,
  },

  cameraStations: {
    showCameraStations: true,
    cameraStationsMinZoom: 11,
  },

  roadworks: {
    showRoadworks: true,
    roadworksMinZoom: 11,
    showIcons: true,
    showLines: false,
  },

  disorders: {
    showDisorders: true,
    disordersMinZoom: 11,
    showIcons: true,
    showLines: false,
    showPolygons: false,
    showPolygonCenterIcon: true,
    showLineIcons: true,
    showUpcoming: false,
    showUpcomingDetour: false,
    colors: {
      LOW: '#FFC107',
      MEDIUM: '#FFC107',
      HIGH: '#FFC107',
      DETOUR: '#00CC66',
      GEOM_OVERRIDE: '#333',
      UPCOMING: '#999',
    },
  },

  trafficAnnouncements: {
    showIcons: true,
    showLines: true,
    showPolygons: true,
    showPolygonCenterIcon: true,
    showLineIcons: true,
    showDetours: false,
    showUpcoming: true,
    showUpcomingDetour: false,
    colors: {
      LOW: '#FFC107',
      MEDIUM: '#FFC107',
      HIGH: '#FFC107',
      CATEGORY: {
        LOS: '#FFC107',
        ACT: '#FFC107',
        MHZ: '#FFC107',
        ACC: '#DC3545',
        DEFAULT: '#0073BF',
      },
      DETOUR: '#00CC66',
      GEOM_OVERRIDE: '#333',
      UPCOMING: '#999',
    },
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

  fluencies: {
    showFluencies: true,
    fluenciesMinZoom: 7,
    showIcons: false,
    showLines: true,
    lineWidth: 5,
    lineWidthHighlighted: 10,
    showEmpty: true,
    colors: {
      TRAFFIC_FLOW_NORMAL: '#28A745',
      TRAFFIC_HEAVIER_THAN_NORMAL: '#FFC107',
      TRAFFIC_MUCH_HEAVIER_THAN_NORMAL: '#DC3545',
      TRAFFIC_FLOW_UNKNOWN: '#999999',
    },
  },

  cityBike: {
    // Config for map features. NOTE: availability for routing is controlled by
    // transportModes.citybike.availableForSelection
    showCityBikes: true,
    showStationId: true,

    useUrl: {
      fi: 'https://kaupunkipyorat.ouka.fi',
      sv: 'https://kaupunkipyorat.ouka.fi/home',
      en: 'https://kaupunkipyorat.ouka.fi/home',
    },

    cityBikeMinZoom: 11,
    cityBikeSmallIconZoom: 14,
    // When should bikeshare availability be rendered in orange rather than green
    fewAvailableCount: 3,
  },

  ecoCounters: {
    showEcoCounters: true,
    ecoCounterMinZoom: 11,
  },

  maintenanceVehicles: {
    showLines: true,
    showMaintenanceVehicles: true,
    maintenanceVehiclesMinZoom: 7,
    timeRanges: {
      60: 'maintenance-vehicle-time-range-1h',
      120: 'maintenance-vehicle-time-range-3h',
      240: 'maintenance-vehicle-time-range-6h',
      720: 'maintenance-vehicle-time-range-12h',
      1440: 'maintenance-vehicle-time-range-1d',
      4320: 'maintenance-vehicle-time-range-3d',
    },
  },

  realtimeMaintenanceVehicles: {
    showRealtimeMaintenanceVehicles: true,
  },

  feedIds: ['OULU'],

  sprites: 'svg-sprite.oulu.svg',

  homeUrl: '/',

  defaultMapZoom: 13,
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

  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
    },

    tram: {
      availableForSelection: false,
      defaultValue: false,
    },

    rail: {
      availableForSelection: true,
      defaultValue: true,
    },

    subway: {
      availableForSelection: false,
      defaultValue: false,
    },

    airplane: {
      availableForSelection: false,
      defaultValue: false,
    },

    ferry: {
      availableForSelection: false,
      defaultValue: false,
    },

    citybike: {
      availableForSelection: true,
      defaultValue: false,
    },
  },

  streetModes: {
    public_transport: {
      availableForSelection: true,
      defaultValue: true,
      exclusive: false,
      icon: 'bus-withoutBox',
    },

    walk: {
      availableForSelection: true,
      defaultValue: false,
      exclusive: true,
      icon: 'walk',
    },

    bicycle: {
      availableForSelection: true,
      defaultValue: false,
      exclusive: true,
      icon: 'bicycle-withoutBox',
    },

    car: {
      availableForSelection: true,
      defaultValue: false,
      exclusive: true,
      icon: 'car-withoutBox',
    },

    car_park: {
      availableForSelection: false,
      defaultValue: false,
      exclusive: false,
      icon: 'car_park-withoutBox',
    },
  },

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
      streetModeHeader: true,
      headerId: 'settings',
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
        href:
          'mailto:palaute.oulunliikenne@ouka.fi?subject=Oulunliikenne BETA palaute',
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
        // header: 'Tietoja Oulunliikenne.fi-palvelusta',
        paragraphs: [
          'Oulunliikenne.fi-palvelu sisältää joukkoliikenteen, kävelyn, pyöräilyn ja autoilun reittioppaat, joukkoliikenteen reaaliaikaisen pysäkki-informaation sekä tietoja liikenneolosuhteista ja liikenteen sujuvuudesta. Palvelun tilaajina ovat Oulun kaupunki ja Pohjois-Pohjanmaan ELY-keskus. Palveluntuottajana toimii Digia Oyj. Palvelu perustuu Digitransit-palvelualustaan.',
        ],
      },
      {
        header: 'Digitransit palvelualusta',
        paragraphs: [
          'Digitransit-palvelualusta on HSL:n ja Traficomin kehittämä avoimen lähdekoodin reititystuote.',
        ],
      },
      {
        header: 'Tietolähteet',
        paragraphs: [
          'Kartat, tiedot kaduista, rakennuksista, pysäkkien sijainneista ynnä muusta tarjoaa © OpenStreetMap contributors. Jos teet muutoksia OSM-karttapohjaan, ilmoita asiasta Oulunliikenne.fi:n ”Anna palautetta” -toiminnolla, jotta muutokset saadaan näkyviin myös Oulunliikenne.fi –palveluun.',
          'Osoitetiedot tuodaan Väestörekisterikeskuksen rakennustietorekisteristä.',
          'Joukkoliikenteen reitit ja aikataulut ladataan Oulun joukkoliikenteen tietokannasta. Joukkoliikenteen aikatauluja ja reittejä koskevaa palautetta voit antaa: https://www.oulunjoukkoliikenne.fi/asiakaspalvelu',
          'Useiden sivustolla esitettyjen liikennetietojen lähteenä on Traffic Management Finland / digitraffic.fi, lisenssi CC 4.0 BY.',
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

  showIntroPopup: false,
  introPopup: {
    fi: {
      header: 'Oulunliikenne.fi uudistuu',
      paragraphs: [
        'Oulunliikenne.fi:n uusi versio otetaan käyttöön 2.6.2019. Tämä on uuden palvelun koekäyttöversio, joka toimii siihen saakka rinnan nykyisen palvelun kanssa.',
        'Voit antaa uuteen palveluun liittyvää palautetta ja kehittämisvinkkejä sivun alareunan ”Anna palautetta” –toiminolla.',
        'Koekäytön aikana palvelu ei vielä kata aivan kaikkia nykyisiä tietolajeja. Mm. kävelijöiden ja pyöräilijöiden laskentatiedot sekä reaaliaikaiset kunnossapitotilannetiedot puuttuvat.',
        'Uusi Oulunliikenne.fi perustuu HSL:n ja Traficomin kehittämään avoimen lähdekoodin Digitransit-palvelualustaan. Monet käyttöliittymän ominaisuuksista tulevat suoraan Reittiopas.fi:n ominaisuuksista.',
      ],
    },
  },

  useModeSpecificMapLayers: true,
  mapLayerDefaultsModeSpecific: {
    PUBLIC_TRANSPORT: {
      stop: {
        bus: true,
      },
      cameraStations: false,
      weatherStations: false,
      disorders: true,
    },
    CAR: {
      parkingStations: false,
      disorders: true,
      roadworks: true,
      cameraStations: true,
      weatherStations: false,
      tmsStations: false,
      roadConditions: false,
      fluencies: true,
      maintenanceVehicles: false,
      realtimeMaintenanceVehicles: true,
    },
    BICYCLE: {
      disorders: true,
      weatherStations: false,
      cameraStations: false,
      // tmsStations: false,
      // citybike: true, NOTE: taken from transportModes.citybike.availableForSelection
      ecoCounters: true,
      maintenanceVehicles: false,
      realtimeMaintenanceVehicles: true,
    },
    WALK: {
      disorders: true,
      weatherStations: false,
      cameraStations: false,
      ecoCounters: true,
      maintenanceVehicles: false,
      realtimeMaintenanceVehicles: true,
      // tmsStations: false,
      // citybike: true, NOTE: taken from transportModes.citybike.availableForSelection
    },
  },
});

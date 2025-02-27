const CONFIG = process.env.CONFIG || 'default';
const API_URL = process.env.API_URL || 'https://api.digitransit.fi';
const GEOCODING_BASE_URL = `${API_URL}/geocoding/v1`;
const MAP_URL = process.env.MAP_URL || 'https://cdn.digitransit.fi';
const APP_PATH = process.env.APP_CONTEXT || '';
const { PIWIK_ADDRESS, PIWIK_ID, SENTRY_DSN } = process.env;
const PORT = process.env.PORT || 8080;
const APP_DESCRIPTION = 'Digitransit journey planning UI';
const OTP_TIMEOUT = process.env.OTP_TIMEOUT || 10000; // 10k is the current server default
const YEAR = 1900 + new Date().getYear();

export default {
  PIWIK_ADDRESS,
  PIWIK_ID,
  SENTRY_DSN,
  PORT,
  CONFIG,
  OTPTimeout: OTP_TIMEOUT,
  URL: {
    API_URL,
    ASSET_URL: process.env.ASSET_URL,
    MAP_URL,
    OTP: process.env.OTP_URL || `${API_URL}/routing/v1/routers/finland/`,
    MAP: {
      default: `${MAP_URL}/map/v3/hsl-map/`,
      sv: `${MAP_URL}/map/v3/hsl-map-sv/`,
    },
    STOP_MAP: `${MAP_URL}/map/v3/finland-stop-map/`,
    CITYBIKE_MAP: `${MAP_URL}/map/v3/hsl-citybike-map/`,
    MQTT: 'wss://mqtt.hsl.fi',
    ALERTS: process.env.ALERTS_URL || `${API_URL}/realtime/service-alerts/v1`,
    FONT:
      'https://fonts.googleapis.com/css?family=Lato:300,400,900%7CPT+Sans+Narrow:400,700',
    REALTIME:
      process.env.VEHICLE_URL || `${API_URL}/realtime/vehicle-positions/v1`,
    PELIAS: `${process.env.GEOCODING_BASE_URL || GEOCODING_BASE_URL}/search`,
    PELIAS_REVERSE_GEOCODER: `${process.env.GEOCODING_BASE_URL ||
      GEOCODING_BASE_URL}/reverse`,
  },

  APP_PATH: `${APP_PATH}`,
  title: 'Reittihaku',

  textLogo: false,
  // Navbar logo
  logo: 'default/digitransit-logo.png',

  contactName: {
    sv: 'Digitransit',
    fi: 'Digitransit',
    default: "Digitransit's",
  },

  // Default labels for manifest creation
  name: 'Digitransit beta',
  shortName: 'Digitransit',

  searchParams: {},
  feedIds: [],

  /*
 * by default search endpoints from all but gtfs sources, correct gtfs source
 * figured based on feedIds config variable
 */
  searchSources: ['oa', 'osm', 'nlsfi'],

  search: {
    suggestions: {
      useTransportIcons: false,
    },
    usePeliasStops: false,
    mapPeliasModality: false,
    peliasMapping: {},
    peliasLayer: null,
    peliasLocalization: null,
    minimalRegexp: new RegExp('.{2,}'),
  },

  nearbyRoutes: {
    radius: 10000,
    bucketSize: 1000,
  },

  defaultSettings: {
    accessibilityOption: 0,
    bikeSpeed: 5,
    minTransferTime: 120,
    optimize: 'QUICK',
    preferredRoutes: [],
    ticketTypes: null,
    transferPenalty: 0,
    unpreferredRoutes: [],
    walkBoardCost: 600,
    walkReluctance: 2,
    walkSpeed: 1.2,
  },

  /**
   * These are used for dropdown selection of values to override the default
   * settings. This means that values ought to be relative to the current default.
   * If not, the selection may not make any sense.
   */
  defaultOptions: {
    walkBoardCost: {
      least: 3600,
      less: 1200,
      more: 360,
      most: 120,
    },
    walkReluctance: {
      least: 5,
      less: 3,
      more: 1,
      most: 0.2,
    },
  },

  quickOptions: {
    public_transport: {
      availableOptionSets: [
        'least-transfers',
        'least-walking',
        'public-transport-with-bicycle',
        'saved-settings',
      ],
    },
    walk: {
      availableOptionSets: ['prefer-walking-routes', 'saved-settings'],
    },
    bicycle: {
      availableOptionSets: [
        'least-elevation-changes',
        'prefer-greenways',
        'saved-settings',
      ],
    },
    car_park: {
      availableOptionSets: [
        'least-transfers',
        'least-walking',
        'saved-settings',
      ],
    },
  },

  maxWalkDistance: 10000,
  maxBikingDistance: 100000,
  itineraryFiltering: 1.5, // drops 66% worse routes
  availableLanguages: ['fi', 'sv', 'en', 'fr', 'nb', 'de'],
  defaultLanguage: 'en',
  // This timezone data will expire in 2037
  timezoneData:
    'Europe/Helsinki|EET EEST|-20 -30|0101010101010101010101010101010101010|22k10 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00|12e5',

  mainMenu: {
    // Whether to show the left menu toggle button at all
    show: true,
    showDisruptions: true,
    showLoginCreateAccount: true,
    showOffCanvasList: true,
  },

  itinerary: {
    // How long vehicle should be late in order to mark it delayed. Measured in seconds.
    delayThreshold: 180,
    // Wait time to show "wait leg"? e.g. 180 means over 3 minutes are shown as wait time.
    // Measured in seconds.
    waitThreshold: 180,
    enableFeedback: false,

    timeNavigation: {
      enableButtonArrows: false,
    },
  },

  nearestStopDistance: {
    maxShownDistance: 5000,
  },

  map: {
    mobileDefaultExpanded: false,
    useRetinaTiles: true,
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    maxZoom: 18,
    controls: {
      zoom: {
        // available controls positions: 'topleft', 'topright', 'bottomleft, 'bottomright'
        position: 'bottomleft',
      },
      scale: {
        position: 'bottomright',
      },
    },
    genericMarker: {
      // Do not render name markers at zoom levels below this value
      nameMarkerMinZoom: 18,

      popup: {
        offset: [106, 16],
        maxWidth: 250,
        minWidth: 250,
      },
    },

    line: {
      halo: {
        weight: 7,
        thinWeight: 4,
      },

      leg: {
        weight: 5,
        thinWeight: 2,
      },

      passiveColor: '#758993',
    },

    useModeIconsInNonTileLayer: false,
  },

  stopCard: {
    header: {
      showDescription: true,
      showStopCode: true,
      showDistance: true,
    },
  },

  autoSuggest: {
    // Let Pelias suggest based on current user location
    locationAware: true,
  },

  useAltRealtimeClient: false,
  routePrefix: 'HSL',

  parkAndRide: {
    showParkAndRide: false,
    parkAndRideMinZoom: 14,
  },

  ticketSales: {
    showTicketSales: false,
    ticketSalesMinZoom: 16,
  },

  parkingStations: {
    showParkingStations: false,
    parkingStationsMinZoom: 14,
  },

  cameraStations: {
    showCameraStations: false,
    cameraStationsMinZoom: 14,
  },

  roadworks: {
    showRoadworks: false,
    roadworksMinZoom: 14,
  },

  disorders: {
    showDisorders: false,
    disordersMinZoom: 14,
  },

  roadConditions: {
    showRoadConditions: false,
    roadConditionsMinZoom: 7,
  },

  fluencies: {
    showFluencies: false,
    fluenciesMinZoom: 7,
  },

  cityWeatherStations: {
    showCityWeatherStations: false,
    cityWeatherStationsMinZoom: 14,
  },

  weatherStations: {
    showWeatherStations: false,
    weatherStationsMinZoom: 14,
  },

  tmsStations: {
    showTmsStations: false,
    tmsStationsMinZoom: 14,
  },

  maintenanceVehicles: {
    showMaintenanceVehicles: false,
  },

  realtimeMaintenanceVehicles: {
    showRealtimeMaintenanceVehicles: false,
  },

  cityBike: {
    // Config for map features. NOTE: availability for routing is controlled by
    // transportModes.citybike.availableForSelection
    showCityBikes: true,
    showStationId: true,

    useUrl: {
      fi: 'https://www.hsl.fi/kaupunkipyorat',
      sv: 'https://www.hsl.fi/sv/stadscyklar',
      en: 'https://www.hsl.fi/en/citybikes',
    },

    cityBikeMinZoom: 14,
    cityBikeSmallIconZoom: 14,
    // When should bikeshare availability be rendered in orange rather than green
    fewAvailableCount: 3,
  },
  // Lowest level for stops and terminals are rendered
  stopsMinZoom: 13,
  // Highest level when stops and terminals are still rendered as small markers
  stopsSmallMaxZoom: 14,
  // Highest level when terminals are still rendered instead of individual stops
  terminalStopsMaxZoom: 17,
  terminalStopsMinZoom: 12,
  terminalNamesZoom: 16,
  stopsIconSize: {
    small: 8,
    selected: 28,
    default: 18,
  },

  // Show button in stops popup for showing the arriving vehicles on the map in realtime
  stopsShowRealtimeTracking: false,
  // Enable realtime vehicles on map by default when opening stops popup
  stopsShowRealtimeTrackingDefault: false,
  stopsRealtimeTrackingLimit: 5,

  appBarLink: { name: 'Digitransit', href: 'https://www.digitransit.fi/' },

  colors: {
    primary: '#00AFFF',
  },

  sprites: 'svg-sprite.default.svg',

  disruption: {
    showInfoButton: true,
  },

  agency: {
    show: true,
  },

  socialMedia: {
    title: 'Digitransit',
    description: APP_DESCRIPTION,
    locale: 'en_US',

    image: {
      url: '/img/default-social-share.png',
      width: 2400,
      height: 1260,
    },

    twitter: {
      card: 'summary_large_image',
      site: '@hsldevcom',
    },
  },

  meta: {
    description: APP_DESCRIPTION,
    keywords: 'digitransit',
  },

  // Ticket information feature toggle
  showTicketInformation: false,
  showRouteInformation: false,

  modeToOTP: {
    bus: 'BUS',
    tram: 'TRAM',
    rail: 'RAIL',
    subway: 'SUBWAY',
    citybike: 'BICYCLE_RENT',
    airplane: 'AIRPLANE',
    ferry: 'FERRY',
    walk: 'WALK',
    bicycle: 'BICYCLE',
    car: 'CAR',
    car_park: 'CAR_PARK',
    public_transport: 'WALK',
  },

  // Control what transport modes that should be possible to select in the UI
  // and whether the transport mode is used in trip planning by default.
  transportModes: {
    bus: {
      availableForSelection: true,
      defaultValue: true,
    },

    tram: {
      availableForSelection: true,
      defaultValue: true,
    },

    rail: {
      availableForSelection: true,
      defaultValue: true,
    },

    subway: {
      availableForSelection: true,
      defaultValue: true,
    },

    airplane: {
      availableForSelection: true,
      defaultValue: true,
    },

    ferry: {
      availableForSelection: true,
      defaultValue: true,
    },

    citybike: {
      availableForSelection: false, // TODO: Turn off in autumn
      defaultValue: false, // always false
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

  accessibilityOptions: [
    {
      messageId: 'accessibility-nolimit',
      displayName: 'Ei rajoitusta',
      value: '0',
    },
    {
      messageId: 'accessibility-limited',
      displayName: 'Liikun pyörätuolilla',
      value: '1',
    },
  ],

  moment: {
    relativeTimeThreshold: {
      seconds: 55,
      minutes: 59,
      hours: 23,
      days: 26,
      months: 11,
    },
  },

  customizeSearch: {
    walkReluctance: {
      available: true,
    },

    walkBoardCost: {
      available: true,
    },

    transferMargin: {
      available: true,
    },

    walkingSpeed: {
      available: true,
    },

    ticketOptions: {
      available: true,
    },

    accessibility: {
      available: true,
    },
    transferpenalty: {
      available: true,
    },
  },

  areaPolygon: [
    [18.776, 60.3316],
    [18.9625, 60.7385],
    [19.8615, 60.8957],
    [20.4145, 61.1942],
    [20.4349, 61.9592],
    [19.7853, 63.2157],
    [20.4727, 63.6319],
    [21.6353, 63.8559],
    [23.4626, 64.7794],
    [23.7244, 65.3008],
    [23.6873, 65.8569],
    [23.2069, 66.2701],
    [23.4627, 66.8344],
    [22.9291, 67.4662],
    [23.0459, 67.9229],
    [20.5459, 68.7605],
    [20.0996, 69.14],
    [21.426, 69.4835],
    [21.9928, 69.4009],
    [22.9226, 68.8678],
    [23.8108, 69.0145],
    [24.6903, 68.8614],
    [25.2262, 69.0596],
    [25.4029, 69.7235],
    [26.066, 70.0559],
    [28.2123, 70.2496],
    [29.5813, 69.7854],
    [29.8467, 69.49],
    [28.9502, 68.515],
    [30.4855, 67.6952],
    [29.4962, 66.9232],
    [30.5219, 65.8728],
    [30.1543, 64.9646],
    [30.9641, 64.1321],
    [30.572, 63.7098],
    [31.5491, 63.3309],
    [31.9773, 62.9304],
    [31.576, 62.426],
    [27.739, 60.1117],
    [26.0945, 59.8015],
    [22.4235, 59.3342],
    [20.2983, 59.2763],
    [19.3719, 59.6858],
    [18.7454, 60.1305],
    [18.776, 60.3316],
  ],

  // If certain mode(s) only exist in limited number of areas, listing the areas as a list of polygons for
  // selected mode key will remove the mode(s) from queries if no coordinates in the query are within the polygon(s).
  // This reduces complexity in finding routes for the query.
  modePolygons: {},

  footer: {
    content: [
      { label: `© HSL, Liikennevirasto ${YEAR}` },
      {},
      {
        name: 'footer-feedback',
        nameEn: 'Submit feedback',
        href: 'https://github.com/HSLdevcom/digitransit-ui/issues',
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

  // Default origin endpoint to use when user is outside of area
  defaultEndpoint: {
    address: 'Helsinki-Vantaan Lentoasema',
    lat: 60.317429,
    lon: 24.9690395,
  },
  defaultOrigins: [
    {
      icon: 'icon-icon_airplane',
      label: 'Helsinki-Vantaan lentoasema',
      lat: 60.317429,
      lon: 24.9690395,
    },
    {
      icon: 'icon-icon_ferry',
      label: 'Turun satama',
      lat: 60.436363,
      lon: 22.220002,
    },
    {
      icon: 'icon-icon_airplane',
      label: 'Rovaniemen lentoasema',
      lat: 66.557326,
      lon: 25.828135,
    },
  ],

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        paragraphs: [
          'Palvelu kattaa joukkoliikenteen, kävelyn, pyöräilyn ja yksityisautoilun rajatuilta osin. Palvelu perustuu Digitransit palvelualustaan.',
        ],
      },
      {
        header: 'Digitransit palvelualusta',
        paragraphs: [
          'Digitransit-palvelualusta on HSL:n ja Liikenneviraston kehittämä avoimen lähdekoodin reititystuote.',
        ],
      },
      {
        header: 'Tietolähteet',
        paragraphs: [
          'Kartat, tiedot kaduista, rakennuksista, pysäkkien sijainnista ynnä muusta tarjoaa © OpenStreetMap contributors. Osoitetiedot tuodaan Väestörekisterikeskuksen rakennustietorekisteristä. Joukkoliikenteen reitit ja aikataulut ladataan Liikenneviraston valtakunnallisesta joukkoliikenteen tietokannasta.',
        ],
      },
    ],

    sv: [
      {
        header: 'Om tjänsten',
        paragraphs: [
          'Reseplaneraren täcker med vissa begränsningar kollektivtrafik, promenad, cykling samt privatbilism. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
      {
        header: 'Digitransit-plattformen',
        paragraphs: [
          'Digitransit-plattformen är en öppen programvara utvecklad av HRT och Trafikverket.',
        ],
      },
      {
        header: 'Datakällor',
        paragraphs: [
          'Kartor, gator, byggnader, hållplatser och dylik information erbjuds av © OpenStreetMap contributors. Addressinformation hämtas från BRC:s byggnadsinformationsregister. Kollektivtrafikens rutter och tidtabeller hämtas från Trafikverkets landsomfattande kollektivtrafiksdatabas.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'The service covers public transport, walking, cycling, and some private car use. Service is built on Digitransit platform.',
        ],
      },
      {
        header: 'Digitransit platform',
        paragraphs: [
          'The Digitransit service platform is an open source routing platform developed by HSL and The Finnish Transport Agency.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          "Maps, streets, buildings, stop locations etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are downloaded from Finnish Transport Agency's national public transit database.",
        ],
      },
    ],
    nb: {},
    fr: {},
    de: {},
  },

  staticMessages: [],

  themeMap: {
    hsl: 'reittiopas',
    turku: '(turku|foli)',
    lappeenranta: 'lappeenranta',
    joensuu: 'joensuu',
    oulu: 'oulu',
    hameenlinna: 'hameenlinna',
    matka: 'matka',
    rovaniemi: 'rovaniemi',
    kouvola: 'kouvola',
    tampere: 'tampere',
    mikkeli: 'mikkeli',
    kotka: 'kotka',
    jyvaskyla: 'jyvaskyla',
    lahti: 'lahti',
    kuopio: 'kuopio',
  },

  piwikMap: [
    // in priority order. 1st match stops
    { id: '10', expr: 'dev-joensuu' },
    { id: '11', expr: 'joensuu' },
    { id: '12', expr: 'dev-turku' },
    { id: '27', expr: '(turku|foli)' },
    { id: '14', expr: 'hameenlinna' },
    { id: '15', expr: 'jyvaskyla' },
    { id: '16', expr: 'kuopio' },
    { id: '17', expr: 'lahti' },
    { id: '18', expr: 'lappeenranta' },
    { id: '21', expr: 'oulu' },
    { id: '29', expr: 'kotka' },
    { id: '31', expr: 'mikkeli' },
    { id: '35', expr: 'tampere' },
    { id: '43', expr: 'kouvola' },
    { id: '49', expr: 'rovaniemi' },
    // put generic expressions last so that they do not match waltti cities
    // e.g. reittiopas.hameenlinna.fi or turku.digitransit.fi
    { id: '5', expr: 'dev.reittiopas' },
    { id: '4', expr: 'reittiopas' },
    { id: '7', expr: 'dev.matka' },
    { id: '6', expr: 'matka' },
    { id: '7', expr: 'dev.digitransit' },
    { id: '6', expr: 'digitransit' },
  ],

  minutesToDepartureLimit: 9,

  imperialEnabled: false,
  // this flag when true enables imperial measurements  'feet/miles system'

  mapLayers: {
    featureMapping: {
      ticketSales: {},
    },
  },

  tosterMessage: {
    autoClose: 5000,
  },
};

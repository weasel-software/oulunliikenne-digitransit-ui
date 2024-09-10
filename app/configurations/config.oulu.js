import configMerger from '../util/configMerger';

const CONFIG = 'oulu';
const APP_DESCRIPTION = 'Oulun seudun uusi reittiopas';
const APP_TITLE = 'Oulun liikenteen reittiopas';

const AWS_REGION = process.env.AWS_REGION || 'eu-central-1';

const OTP_URL = process.env.OTP_URL || 'https://api-dev.oulunliikenne.fi/proxy';
const API_URL = process.env.API_URL || 'https://api.digitransit.fi';
const MAP_URL =
  process.env.MAP_URL || 'https://digitransit-prod-cdn-origin.azureedge.net';
const AWS_MAP_URL =
  process.env.AWS_MAP_URL || 'https://d2lk9qao4tzpwi.cloudfront.net';
const MQTT_URL =
  process.env.MQTT_URL || 'angqxp7s7wkrp-ats.iot.eu-central-1.amazonaws.com';
const AWS_IDENTITY_POOL_ID =
  process.env.AWS_IDENTITY_POOL_ID ||
  'eu-central-1:8f58773b-4d45-46bc-9534-5a9a0d19c76d';

const SUBSCRIPTION_KEY = process.env.SUBSCRIPTION_KEY || null;

const ANALYTICS_URL = 'https://kapydata.oulunseudunpyoraily.fi/';

const walttiConfig = require('./waltti').default;

export default configMerger(walttiConfig, {
  CONFIG,

  AWS: {
    region: AWS_REGION,
    iot: {
      identityPoolId: AWS_IDENTITY_POOL_ID,
    },
  },

  SUBSCRIPTION_KEY,

  URL: {
    API_URL,
    MAP_URL,
    OTP: OTP_URL,
    MQTT: MQTT_URL,
    STOP_MAP: `${MAP_URL}/map/v2/waltti-stop-map/`,
    CITYBIKE_MAP: `${AWS_MAP_URL}/map/bicyclestations/`,
    PARKING_STATIONS_MAP: `${AWS_MAP_URL}/map/carparks/`,
    CAMERASTATIONS_MAP: `${AWS_MAP_URL}/map/cameras/`,
    ROADWORKS_MAP: `${AWS_MAP_URL}/map/roadworks/`,
    DISORDERS_MAP: `${AWS_MAP_URL}/map/disruptions/`,
    WEATHER_STATIONS_MAP: `${AWS_MAP_URL}/map/weatherstations/`,
    CITY_WEATHER_STATIONS_MAP: `${AWS_MAP_URL}/map/cityweatherstations/`,
    TMS_STATIONS_MAP: `${AWS_MAP_URL}/map/tmsstations/`,
    ROAD_CONDITIONS_MAP: `${AWS_MAP_URL}/map/roadconditions/`,
    FLUENCY_MAP: `${AWS_MAP_URL}/map/fluency/`,
    ECO_COUNTERS_MAP: `${AWS_MAP_URL}/map/ecocounters/`,
    MAINTENANCE_VEHICLE_NON_MOTORISED_MAP: `${AWS_MAP_URL}/map/maintenanceroutesnonmotorised/`,
    MAINTENANCE_VEHICLE_MOTORISED_MAP: `${AWS_MAP_URL}/map/maintenanceroutesmotorised/`,
    ROAD_SIGNS_MAP: `${AWS_MAP_URL}/map/roadsigns/`,
    BICYCLE_ROUTES_MAIN_REGIONAL_MAP: `${AWS_MAP_URL}/map/bicycleroutesmainregional/`,
    BICYCLE_ROUTE_TYPES_MAP: `${AWS_MAP_URL}/map/bicycleroutetypes/`,
    BICYCLE_ROUTES_BAANA_MAP: `${AWS_MAP_URL}/map/bicycleroutesbaana/`,
    BICYCLE_ROUTES_BRAND_MAP: `${AWS_MAP_URL}/map/bicycleroutesbrand/`,
    ANALYTICS: ANALYTICS_URL,
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

  cityWeatherStations: {
    showCityWeatherStations: true,
    cityWeatherStationsMinZoom: 11,
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
        RES: '#FFC107',
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
    showCityBikes: false, // turn on in spring
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
      180: 'maintenance-vehicle-time-range-3h',
      360: 'maintenance-vehicle-time-range-6h',
      720: 'maintenance-vehicle-time-range-12h',
      1440: 'maintenance-vehicle-time-range-1d',
      4320: 'maintenance-vehicle-time-range-3d',
      43200: 'maintenance-vehicle-time-range-30d',
    },
  },

  realtimeMaintenanceVehicles: {
    showRealtimeMaintenanceVehicles: true,
  },

  roadInspectionVehicles: {
    showLines: true,
    showRoadInspectionVehicles: true,
    roadInspectionVehiclesMinZoom: 7,
  },

  roadSigns: {
    showRoadSigns: true,
    roadSignsMinZoom: 11,
  },

  bicycleRoutes: {
    showLines: true,
    showBicycleRoutes: true,
    bicycleRoutesMinZoom: 11,
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
      availableForSelection: false, // turn on in spring
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
          'mailto:palaute.oulunliikenne@ouka.fi?subject=Oulunliikenne palaute',
        icon: 'icon-icon_speech-bubble',
      },
      {
        name: 'about-this-service',
        nameEn: 'About this service',
        route: '/tietoja-palvelusta',
        icon: 'icon-icon_info',
      },
      {
        name: 'accessibility-report',
        route: '/saavutettavuusseloste',
        languages: ['fi'],
      },
    ],
  },

  aboutThisService: {
    fi: [
      {
        header: 'Tietoja palvelusta',
        // header: 'Tietoja Oulunliikenne.fi-palvelusta',
        paragraphs: [
          'Oulunliikenne.fi-palvelu sisältää joukkoliikenteen, kävelyn, pyöräilyn ja autoilun reittioppaat, joukkoliikenteen reaaliaikaisen pysäkki-informaation sekä tietoja liikenneolosuhteista ja liikenteen sujuvuudesta. Palvelun tilaajina ovat Oulun kaupunki ja Pohjois-Pohjanmaan ELY-keskus. Palveluntuottajana toimii Weasel Software Oy. Palvelu perustuu Digitransit-palvelualustaan. Katso palvelun englanninkielinen tekninen kuvaus {link}.',
        ],
        link: {
          href:
            'https://wp.oulunliikenne.fi/wp-content/uploads/2022/02/Oulunliikenne.fi_service_documentation.pdf',
          text: 'tästä',
        },
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
          'Den här tjänsten omfattar reseplaneraren för kollektivtrafik, promenad, cykling och privat bilanvändning i Uleåborgsregionen. Tjänsten inkluderar passagerarinformation i realtid och information om vägförhållanden och rusningar. Tjänsten erbjuds av Uleåborgs stad och NTM-centralen i Norra Österbotten. Serviceproducenten är Weasel Software Oy. Tjänsten baserar sig på Digitransit-plattformen.',
        ],
      },
      {
        header: 'Digitransit-plattformen',
        paragraphs: [
          'Digitransit-plattformen är en öppen programvara utvecklad av Helsingforsregionens trafik (HRT) och Trafikverket.',
        ],
      },
      {
        header: 'Datakällor',
        paragraphs: [
          'Kartor och informationen om gator, byggnader, hållplatser och så vidare erbjuds av © OpenStreetMap contributors. Addressinformation hämtas från BRC:s byggnadsinformationsregister. Kollektivtrafikens rutter och tidtabeller hämtas från Uleåborgs stads kollektivtrafiksdatabas.',
          'Källan till många trafikinformation som publiceras i tjänsten är Traffic Management Finland / digitraffic.fi, lisence CC 4.0 BY.',
        ],
      },
    ],

    en: [
      {
        header: 'About this service',
        paragraphs: [
          'The service covers route planners for public transport, walking, cycling and private car use in Oulu region. The service includes real-time passenger information and information of road conditions and traffic congestions. This service is provided by City of Oulu and ELY Center of North Ostrobothnia. The service producer is Weasel Software Ltd. The service is built on Digitransit platform.',
        ],
      },
      {
        header: 'Digitransit platform',
        paragraphs: [
          'The Digitransit platform is an open source routing platform developed by Helsinki Region Transport (HSL) and Finnish Transport Agency.',
        ],
      },
      {
        header: 'Data sources',
        paragraphs: [
          'The maps and the information of streets, buildings, bus stops etc. are provided by © OpenStreetMap contributors. Address data is retrieved from the Building and Dwelling Register of the Finnish Population Register Center. Public transport routes and timetables are downloaded from the database of Oulu Public Transport Authority.',
          'The source of many traffic information published in the service is Traffic Management Finland / digitraffic.fi, lisence CC 4.0 BY.',
        ],
      },
    ],
  },

  accessibilityReport: {
    fi: [
      {
        header: 'Saavutettavuusseloste',
        paragraphs: [
          'Tämä seloste koskee Oulun Liikenteen digitaalisia palveluita sivulla www.oulunliikenne.fi',
          'Tämä seloste on laadittu 27.1.2022 ja päivitetty 9.9.2022\n' +
            'Palvelun saavutettavuuden on arvioinut ulkopuolinen asiantuntijaorganisaatio, jonka avustuksella palvelua kehitetään jatkuvasti saavutettavammaksi.',
          '{bold} Oulunliikenne.fi -sivuston saavutettavuuden tila:',
          'Oulunliikenne.fi-palvelu täyttää saavutettavuusvaatimukset osittain. Palvelun saavutettavuuspuutteiden korjauksia toteutetaan tulevaisuudessa.',
          '{bold} Alla mainittu sisältö ei ole WCAG-kriteerien mukaan saavutettava:',
        ],
      },
      {
        header2: '1. Havaittavuus',
        paragraphs: [
          'Puutteen kuvaus \n' +
            '(WCAG-saavutettavuuskriteerit, jotka eivät täyty):',
        ],
        list: [
          'Visuaaliset taulukot (esim. Aikataulut) eivät ole ohjelmallisesti taulukkoja.',
          'Osa listoista ei ole ohjelmallisesti listoja, esimerkiksi Asetuksissa olevat listat.',
          'Reittiehdotukset-näkymässä Asetukset-valikko on vain visuaalisesti piilotettu, vaikka on ohjelmallisesti saatavilla.\n' +
            '(WCAG 1.3.2)',
        ],
      },
      {
        paragraphs: ['{bold} VÄRIT JA KONTRASTIT'],
        list: [
          'Joissain sisällöissä väriä käytetään ainoana visuaalisena keinona informaation välittämisessä.',
          'Sivustolla on kahta eri väriä olevia Häiriö-ikoneita, käyttäjä ei saa lisätietoa miten eriväriset häiriöikonit eroavat toisistaan.',
          'Kunnossapito, Kelintarkistus, Pyörätiet: Oikean alakulman eri kategoriat ilmoitetaan vain väreillä, kartassa ilmaistaan eri kategoriat vain väreillä.',
          'Ruuhkat, Ajokeli: Eroista viestitään pelkillä väreillä. Eroista viestitään pelkillä väreillä myös kartalla.',
          'Ajokeli-, Kunnossapito- ja Kelintarkistus-laatikot: Tietoa ilmaistaan vain eri värisillä ympyröillä.\n' +
            '(WCAG 1.4.1)',
          'Tekstin ja taustavärin kontrasti ei ole kaikissa tapauksissa riittävän suuri.',
          'Puutteita kontrasteissa: \n' +
            'Reittiehdotukset-sivulla Asetukset.\n' +
            'Linja-sivulla ei-aktiiviset välilehdet.\n' +
            'Muut kulkumuodot-valikon linkit.\n' +
            '(WCAG 1.4.3)',
          'Ei tekstimuotoisen sisällön kontrastit.\n(WCAG 1.4.11)',
        ],
      },
      {
        header2: '2. Hallittavuus',
        paragraphs: [
          'Puutteen kuvaus \n' +
            '(WCAG-saavutettavuuskriteerit, jotka eivät täyty):',
        ],
        list: [
          'Joihinkin toimintoihin ei pääse ruudunlukijalla tai näppäimistöllä navigoimalla.',
          'Linkit-ikkunaa ei saa suljettua pelkällä näppäimistöllä.',
          'Kartalla olevia tietoja ei voi hallita pelkällä näppäimistöllä.',
          'Häiriöt -painikkeeseen ei pääse näppäimistöllä.\n' +
            '(WCAG 2.1.1., 2.1.2)',
          'Pysäkkien ”reaaliaika”-ajat on merkitty ikonilla, joka vilkkuu, eikä vilkkuvaa sisältöä voi tauottaa, pysäyttää tai piilottaa. (HUOM. Chrome ja Firefox, ei Safari) \n' +
            '(WCAG 2.2.2)',
          'Sivustolla ei ole mekanismia ohittaa toistuvia lohkoja. \n' +
            '(WCAG 2.4.1)',
          'Sivuston sivuilla on osittain puutteelliset sivuotsikot. \n' +
            '(WCAG 2.4.2)',
          'Osoitinlaitteella tehtyä valintaa ei voi kaikkialla peruuttaa. \n' +
            '(WCAG 2.5.2)',
          'Joillakin elementeillä visuaalinen nimi ei vastaa ohjelmallista nimeä. \n' +
            '(WCAG 2.5.3)',
        ],
      },
      {
        header2: '3. Ymmärrettävyys',
        paragraphs: [
          'Puutteen kuvaus \n' +
            '(WCAG-saavutettavuuskriteerit, jotka eivät täyty):',
        ],
        list: [
          'Käyttäjälle ei ilmoiteta virheellisestä syötteestä. Hakukentissä virheellisestä syötteestä ei ilmoiteta, vaan annetaan lähin mahdollinen tulos. \n' +
            '(WCAG 3.3.1, 3.3.3)',
        ],
      },
      {
        header2: '4. Toimintavarmuus',
        paragraphs: [
          'Puutteen kuvaus \n' +
            '(WCAG-saavutettavuuskriteerit, jotka eivät täyty):',
        ],
        list: [
          'Sivuston koodi ei ole täysin standardinmukaista. \n' +
            '(WCAG 4.1.1)',
          'Ruudunlukijakäyttäjälle ei viestitä suosikin lisäämisen tai poistamisen onnistumisesta tai epäonnistumisesta. \n' +
            '(WCAG 4.1.3)',
        ],
      },
      {
        header2: 'Palaute ja yhteystiedot',
        paragraphs: [
          '',
          'Tarjoamme puhelimitse tukea asiakaspalvelussamme käyttäjille, joille digipalvelut eivät ole saavutettavissa. Oulun joukkoliikenteen asiakaspalvelu on avoinna ma–pe klo 9–15.30. Puhelinnumeromme on 08 5584 0400.',
          'Huomasitko saavutettavuuspuutteen Oulunliikenne.fi -palvelussa? Kerro se meille ja teemme parhaamme puutteen korjaamiseksi. Otamme mielellämme vastaan huomioita ja parannusehdotuksia.',
          'Voit lähettää saavutettavuuspalautetta sähköpostitse osoitteeseen: \n' +
            '{link}',
        ],
        link: {
          href: 'mailto:palaute.oulunliikenne@ouka.fi',
          text: 'palaute.oulunliikenne@ouka.fi',
        },
      },
      {
        paragraphs: [
          'Joukkoliikenteen toimintaa koskevat palautteet pyydämme lähettämään nettilomakkeen avulla osoitteessa {link}',
          '{bold} Saavutettavuuskantelun ja -selvityspyynnön tekeminen',
          'Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan kahden viikon aikana, voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon. Etelä-Suomen aluehallintovirasto valvoo saavutettavuusvaatimusten noudattamista Suomessa. ',
          '{bold} Valvontaviranomaisen yhteystiedot',
          'Etelä-Suomen aluehallintovirasto\n' +
            'Saavutettavuuden valvonnan yksikkö\n' +
            'www.saavutettavuusvaatimukset.fi\n' +
            'saavutettavuus(at)avi.fi\n' +
            'puhelinnumero vaihde 0295 016 000',
        ],
        link: {
          href: 'https://www.oulunjoukkoliikenne.fi/asiakaspalvelu',
          text: 'https://www.oulunjoukkoliikenne.fi/asiakaspalvelu',
        },
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
      cityWeatherStations: false,
      weatherStations: true,
      disorders: true,
    },
    CAR: {
      parkingStations: false,
      disorders: true,
      roadworks: true,
      cameraStations: true,
      cityWeatherStations: false,
      weatherStations: true,
      tmsStations: false,
      roadConditions: false,
      fluencies: true,
      maintenanceVehicles: false,
      realtimeMaintenanceVehicles: false,
      roadInspectionVehicles: false,
      roadSigns: true,
    },
    BICYCLE: {
      disorders: true,
      cityWeatherStations: true,
      weatherStations: false,
      cameraStations: false,
      // tmsStations: false,
      // citybike: true, NOTE: taken from transportModes.citybike.availableForSelection
      ecoCounters: true,
      maintenanceVehicles: true,
      realtimeMaintenanceVehicles: true,
      roadInspectionVehicles: false,
      bicycleRoutes: true,
      bicycleRoutesMainContract: false,
      bicycleRoutesMainRegional: true,
      bicycleRouteTypes: true,
      bicycleRoutesBaana: true,
      bicycleRoutesBrand: true,
    },
    WALK: {
      disorders: true,
      cityWeatherStations: true,
      weatherStations: false,
      cameraStations: false,
      ecoCounters: true,
      maintenanceVehicles: true,
      realtimeMaintenanceVehicles: true,
      roadInspectionVehicles: false,
      // tmsStations: false,
      // citybike: true, NOTE: taken from transportModes.citybike.availableForSelection
    },
  },
});

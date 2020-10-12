/**
 * StreetMode depicts different kinds of mode available as non-public transportation.
 */
export const StreetMode = {
  /** Cycling */
  Bicycle: 'BICYCLE',
  /** Driving */
  Car: 'CAR',
  /** Driving and parking */
  ParkAndRide: 'CAR_PARK',
  /** Walking */
  Walk: 'WALK',
};

/**
 * TransportMode depicts different kinds of mode available as public transportation.
 */
export const TransportMode = {
  /** Taking the airplane */
  Airplane: 'AIRPLANE',
  /** Taking the bus */
  Bus: 'BUS',
  /** Cycling with a city bike */
  Citybike: 'CITYBIKE',
  /** Taking the ferry */
  Ferry: 'FERRY',
  /** Taking the train */
  Rail: 'RAIL',
  /** Taking the subway */
  Subway: 'Subway',
  /** Taking the tram */
  Tram: 'TRAM',
};

/**
 * Mode depicts different kinds of mode available as any kind of transportation.
 */
export const Mode = {
  ...StreetMode,
  ...TransportMode,
};

/**
 * OptimizeType depicts different types of OTP routing optimization.
 */
export const OptimizeType = {
  /** Avoid changes in altitude. Needs elevation data in OTP to work. */
  Flat: 'FLAT',
  /** Weights cycleways even more. Used only for biking. */
  Greenways: 'GREENWAYS',
  /** The quickest route. */
  Quick: 'QUICK',
  /** The safest route. */
  Safe: 'SAFE',
  /** Uses the flat/quick/safe triangle for routing. Used only for biking. */
  Triangle: 'TRIANGLE',
};

/**
 * QuickOptionSetType depicts different types of quick routing settings sets.
 */
export const QuickOptionSetType = {
  DefaultRoute: 'default-route',
  LeastElevationChanges: 'least-elevation-changes',
  LeastTransfers: 'least-transfers',
  LeastWalking: 'least-walking',
  PreferGreenways: 'prefer-greenways',
  PreferWalkingRoutes: 'prefer-walking-routes',
  SavedSettings: 'saved-settings',
};

export const MaintenanceJobColors = {
  1370: '#582403',
  1367: '#ff5600',
  1368: '#ff5600',
  1369: '#ff5600',
  1366: '#F347E8',
  2864: '#F347E8',
  1357: '#9073ac',
  99901: '#9073ac',
  0: '#1C95F2',
};

export const MaintenanceJobPriorities = {
  1370: 1,
  1367: 2,
  1368: 3,
  1369: 4,
  1366: 5,
  2864: 6,
  1357: 7,
  99901: 8,
  0: 9,
};

export const BicycleRouteMainRegionalLines = {
  'MAIN_REGIONAL-MAIN': {
    color: '#FF4B00',
    dashed: false,
  },
  'MAIN_REGIONAL-REGIONAL': {
    color: '#0065FF',
    dashed: false,
  },
  'MAIN_REGIONAL-PLANNED_MAIN': {
    color: '#FF4B00',
    dashed: true,
  },
  'MAIN_REGIONAL-PLANNED_REGIONAL': {
    color: '#0065FF',
    dashed: true,
  },
};

export const BicycleRouteTypeLines = {
  'TYPES-2_WAY': {
    color: '#FF06BE',
    dashed: false,
  },
  'TYPES-SLOW_STREET': {
    color: '#FFA000',
    dashed: false,
  },
  'TYPES-BICYCLE_LANE': {
    color: '#9F08E2',
    dashed: false,
  },
  'TYPES-SHARED_SPACE': {
    color: '#FFFF00',
    dashed: false,
  },
  'TYPES-4MW_SHARED': {
    color: '#0065FF',
    dashed: false,
  },
  'TYPES-35MW_SHARED': {
    color: '#00BEFF',
    dashed: false,
  },
  'TYPES-ACCESS_ROAD': {
    color: '#9E3100',
    dashed: false,
  },
  'TYPES-WIDE_SHOULDER': {
    color: '#42E200',
    dashed: false,
  },
};

export const BicycleRouteBaanaLines = {
  'BAANA-PLANNED': {
    color: '#191919',
    dashed: true,
  },
  'BAANA-CURRENT': {
    color: '#191919',
    dashed: false,
  },
};

export const BicycleRouteBrandLines = {
  'BRAND-MAIN': {
    color: '#FF06BE',
    dashed: false,
  },
  'BRAND-PERIMETER': {
    color: '#FFA000',
    dashed: false,
  },
};

export const BicycleRouteLines = {
  ...BicycleRouteMainRegionalLines,
  ...BicycleRouteTypeLines,
  ...BicycleRouteBaanaLines,
  ...BicycleRouteBrandLines,
};

export const BicycleRouteLinePriorities = {
  'BAANA-CURRENT': 1,
  'BAANA-PLANNED': 2,
  'BRAND-MAIN': 3,
  'BRAND-PERIMETER': 4,
  'MAIN_REGIONAL-MAIN': 5,
  'MAIN_REGIONAL-PLANNED_MAIN': 6,
  'MAIN_REGIONAL-REGIONAL': 7,
  'MAIN_REGIONAL-PLANNED_REGIONAL': 8,
  'TYPES-2_WAY': 9,
  'TYPES-4MW_SHARED': 10,
  'TYPES-35MW_SHARED': 11,
  'TYPES-SLOW_STREET': 12,
  'TYPES-BICYCLE_LANE': 13,
  'TYPES-SHARED_SPACE': 14,
  'TYPES-ACCESS_ROAD': 15,
  'TYPES-WIDE_SHOULDER': 16,
};

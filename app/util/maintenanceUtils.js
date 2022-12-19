import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
import {
  BrushingJobIds,
  MaintenanceJobPriorities,
  MaintenanceVehicleAllowedInactivitySeconds,
  NonInspectionMaintenanceJobIds,
  RoadInspectionJobId,
} from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const sortByPriority = jobIds =>
  jobIds.sort(
    (first, second) =>
      MaintenanceJobPriorities[first] - MaintenanceJobPriorities[second],
  );

export const getTileLayerFeaturesToRender = ({
  featureArray,
  timeRange,
  includeOnlyInspectionJob,
  includeOnlyBrushingJobs,
  includeOnlyContractType,
}) => {
  let targetedJobIds = [];
  if (includeOnlyInspectionJob) {
    targetedJobIds = [RoadInspectionJobId];
  } else if (includeOnlyBrushingJobs) {
    targetedJobIds = BrushingJobIds;
  } else {
    targetedJobIds = NonInspectionMaintenanceJobIds;
  }

  const baseFeatures = [];
  const jobFeatures = [];

  for (let j = 0; j < featureArray.length; j++) {
    const feature = featureArray.feature(j);
    if (feature.properties.jobId === 0) {
      baseFeatures.push(feature);
    } else if (targetedJobIds.includes(feature.properties.jobId)) {
      jobFeatures.push(feature);
    }
  }

  const selectedTimeRange = Date.now() / 1000 - timeRange * 60;
  const timeFilteredFeatures = jobFeatures.filter(f => {
    if (!includeOnlyInspectionJob && !includeOnlyBrushingJobs) {
      return f.properties.timestamp >= selectedTimeRange;
    }
    return true;
  });

  const sortedFeatures = orderBy(
    timeFilteredFeatures,
    'properties.timestamp',
    'desc',
  );
  const uniqueFeatures = uniqBy(
    sortedFeatures.concat(baseFeatures),
    'properties.hash',
  );

  return uniqueFeatures.filter(f => {
    if (!includeOnlyContractType) {
      return true;
    }
    return f.properties.contractType === includeOnlyContractType;
  });
};

export const clearStaleMaintenanceVehicles = vehicles => {
  const onlyCurrentVehicles = {};
  Object.values(vehicles).forEach(v => {
    if (
      v.timestamp >=
      Date.now() / 1000 - MaintenanceVehicleAllowedInactivitySeconds
    ) {
      onlyCurrentVehicles[v.id] = v;
    }
  });
  return onlyCurrentVehicles;
};

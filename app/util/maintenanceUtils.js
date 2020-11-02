import {
  MaintenanceJobPriorities,
  RoadInspectionJobId,
  NonInspectionMaintenanceJobIds,
  BrushingJobIds,
  MaintenanceVehicleAllowedInactivitySeconds,
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
}) => {
  const jobActualizations = [];
  const geometryDict = {};
  for (let j = 0; j < featureArray.length; j++) {
    const feature = featureArray.feature(j);
    const { hash, id } = feature.properties;
    if (id) {
      // push all real jobs (non-zero jobId) to be handled separately
      jobActualizations.push(feature);
    } else {
      // insert all basic geometries (jobId zero) by hash
      geometryDict[hash] = feature;
    }
  }

  let targetedJobIs = [];
  if (includeOnlyInspectionJob) {
    targetedJobIs = [RoadInspectionJobId];
  } else if (includeOnlyBrushingJobs) {
    targetedJobIs = BrushingJobIds;
  } else {
    targetedJobIs = NonInspectionMaintenanceJobIds;
  }

  // Iterate jobActualizations and pick geometries according to the criteria:
  //  1) includeOnlyInspectionJob: pick jobId [99902], timerange does not matter
  //  2) includeOnlyBrushingJobs: pick jobIds [99901, 1357], timerange does not matter
  //  3) maintenance selection: ignore jobId [99902], pick only the latest job for the geometry
  //     because the response can also include brushing and inspection, which have a broader
  //     time window than other maintenance jobs.
  if (includeOnlyInspectionJob || includeOnlyBrushingJobs) {
    for (let i = 0; i < jobActualizations.length; i++) {
      const feature = jobActualizations[i];
      const { jobId, hash } = feature.properties;
      if (targetedJobIs.includes(jobId)) {
        geometryDict[hash] = feature;
      }
    }
  } else {
    jobActualizations.sort(
      (feat1, feat2) => feat2.properties.timestamp - feat1.properties.timestamp,
    );
    const selectedTimeRange = Date.now() / 1000 - timeRange * 60;
    for (let i = 0; i < jobActualizations.length; i++) {
      const feature = jobActualizations[i];
      const { hash, jobId, timestamp } = feature.properties;
      if (
        NonInspectionMaintenanceJobIds.includes(jobId) &&
        timestamp >= selectedTimeRange
      ) {
        const existingFeature = geometryDict[hash];
        if (existingFeature) {
          // now we need to look if the replacable geometry really has jobId 0
          // if no, then we do nothing (only replace basic geometry with latest job)
          if (existingFeature.properties.jobId === 0) {
            geometryDict[hash] = feature;
          }
        } else {
          // geometryDict does not yet include this hash so there
          // was no basic geometry for this particular actualization
          geometryDict[hash] = feature;
        }
      }
    }
  }
  // Collect values to be rendered and sort by existence of id (jobId 0 to the end)
  return Object.values(geometryDict).sort((feat1, feat2) => {
    if (feat1.properties.id && !feat2.properties.id) {
      return -1;
    } else if (!feat1.properties.id && feat2.properties.id) {
      return 1;
    }
    return 0;
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

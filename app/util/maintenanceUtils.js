import uniqBy from 'lodash/uniqBy';
import {
  MaintenanceJobPriorities,
  RoadInspectionJobId,
  OtherMaintenanceJobIds,
} from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const sortByPriority = jobIds =>
  jobIds.sort(
    (first, second) =>
      MaintenanceJobPriorities[first] - MaintenanceJobPriorities[second],
  );

export const getTileLayerFeaturesToRender = (
  tileLayerFeatures,
  onlyInspectionJob,
) => {
  // Sort the features by existence of ID
  const sortedFeatures = tileLayerFeatures.sort((feat1, feat2) => {
    if (feat1.properties.id && !feat2.properties.id) {
      return -1;
    } else if (!feat1.properties.id && feat2.properties.id) {
      return 1;
    }
    return 0;
  });

  // Filter out jobIds that we are currently not interested in
  const targetedJobs = onlyInspectionJob
    ? [RoadInspectionJobId]
    : OtherMaintenanceJobIds;
  const filteredFeatures = sortedFeatures.filter(
    f => !f.properties.id || targetedJobs.includes(f.properties.jobId),
  );

  // Pick only one geometry (now the actual jobs are first and basic geometries in the end)
  return uniqBy(filteredFeatures, 'properties.hash');
};

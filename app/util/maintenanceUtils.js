import { MaintenanceJobPriorities } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const sortByPriority = jobIds =>
  jobIds.sort(
    (first, second) =>
      MaintenanceJobPriorities[first] - MaintenanceJobPriorities[second],
  );

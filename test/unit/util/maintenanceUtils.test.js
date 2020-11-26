import { expect } from 'chai';
import { describe, it } from 'mocha';

import { BrushingJobIds, RoadInspectionJobId } from '../../../app/constants';
import { MockTileLayers } from '../test-data/mockTileLayers';
import {
  getTileLayerFeaturesToRender,
  clearStaleMaintenanceVehicles,
} from '../../../app/util/maintenanceUtils';

describe('maintenanceUtils', () => {
  describe('getTileLayerFeaturesToRender', () => {
    const getUniqueIds = layers =>
      layers.reduce(
        (prev, curr) =>
          prev.includes(curr.properties.jobId)
            ? prev
            : [...prev, curr.properties.jobId],
        [],
      );

    const hasDuplicateHashes = layers => {
      const hashes = {};
      for (let i = 0; i < layers.length; i++) {
        if (hashes[layers[i].properties.hash]) {
          return true;
          // eslint-disable-next-line no-else-return
        } else {
          hashes[layers[i].properties.hash] = true;
        }
      }
      return false;
    };

    describe('other maintenance jobs', () => {
      const opts = {
        featureArray: new MockTileLayers(),
        timeRange: 1440,
        includeOnlyInspectionJob: false,
        includeOnlyBrushingJobs: false,
      };
      it('must not contain inspection jobid', () => {
        const res = getTileLayerFeaturesToRender(opts);
        const ids = getUniqueIds(res);
        expect(ids).to.not.include(RoadInspectionJobId);
        expect(ids).to.include(99901);
        expect(ids).to.include(1370);
        expect(ids).to.include(1369);
      });
      it('must contain jobId 0 for inspection job geometry', () => {
        const res = getTileLayerFeaturesToRender(opts);
        const inspectionJobGeometry = res.find(
          ({ properties }) => properties.hash === 'DDD',
        );
        expect(inspectionJobGeometry.properties.jobId).to.eq(0);
      });
      it('must not contain duplicate hashes', () => {
        const res = getTileLayerFeaturesToRender(opts);
        expect(hasDuplicateHashes(res)).to.eq(false);
      });
    });

    describe('inspection jobs', () => {
      const opts = {
        featureArray: new MockTileLayers(),
        timeRange: 1440,
        includeOnlyInspectionJob: true,
        includeOnlyBrushingJobs: false,
      };
      it('must not contain other non-zero jobIds than inspection job', () => {
        const res = getTileLayerFeaturesToRender(opts);
        const ids = getUniqueIds(res);
        ids.forEach(id => expect([0, RoadInspectionJobId]).to.include(id));
      });
      it('must contain jobId 0 for all other geometries than inspection', () => {
        const res = getTileLayerFeaturesToRender(opts);
        const otherJobGeometries = res.filter(
          ({ properties }) => properties.hash !== 'DDD',
        );
        otherJobGeometries.forEach(({ properties }) => {
          expect(properties.jobId).to.eq(0);
        });
      });
      it('must not contain duplicate hashes', () => {
        const res = getTileLayerFeaturesToRender(opts);
        expect(hasDuplicateHashes(res)).to.eq(false);
      });
    });

    describe('only brushing jobs', () => {
      const opts = {
        featureArray: new MockTileLayers(),
        timeRange: 1440,
        includeOnlyInspectionJob: false,
        includeOnlyBrushingJobs: true,
      };
      it('must not contain other non-zero jobIds than brushing job', () => {
        const res = getTileLayerFeaturesToRender(opts);
        const ids = getUniqueIds(res);
        ids.forEach(id => expect([...BrushingJobIds, 0]).to.include(id));
      });
      it('must contain jobId 0 for all other geometries than brushing', () => {
        const res = getTileLayerFeaturesToRender(opts);
        const otherJobGeometries = res.filter(
          ({ properties }) => properties.hash !== 'BBB',
        );
        otherJobGeometries.forEach(({ properties }) => {
          expect(properties.jobId).to.eq(0);
        });
      });
      it('must not contain duplicate hashes', () => {
        const res = getTileLayerFeaturesToRender(opts);
        expect(hasDuplicateHashes(res)).to.eq(false);
      });
    });
  });
  describe('clearStaleMaintenanceVehicles', () => {
    const nyt = Math.floor(Date.now() / 1000);
    const vehicles = {
      727: {
        id: 727,
        timestamp: nyt,
      },
      728: {
        id: 728,
        timestamp: nyt - 10,
      },
      729: {
        id: 729,
        timestamp: nyt - 400,
      },
      730: {
        id: 730,
        timestamp: nyt - 3,
      },
    };
    it('clears vehicles older than constants.MaintenanceVehicleAllowedInactivitySeconds', () => {
      const res = clearStaleMaintenanceVehicles(vehicles);
      expect(res).to.deep.equal({
        727: {
          id: 727,
          timestamp: nyt,
        },
        728: {
          id: 728,
          timestamp: nyt - 10,
        },
        730: {
          id: 730,
          timestamp: nyt - 3,
        },
      });
    });
  });
});

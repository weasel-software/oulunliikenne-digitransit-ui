import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getTileLayerFeaturesToRender } from '../../../app/util/maintenanceUtils';
import { RoadInspectionJobId } from '../../../app/constants';
import { mockTileLayers } from '../test-data/mockTileLayers';

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
      layers.forEach(({ properties }) => {
        if (hashes[properties.hash]) {
          hashes[properties.hash] += 1;
        } else {
          hashes[properties.hash] = 1;
        }
      });
      return (
        Object.values(hashes).reduce((prev, curr) => Math.max(prev, curr)) > 1
      );
    };

    describe('other maintenance jobs', () => {
      it('must not contain inspection jobid', () => {
        const res = getTileLayerFeaturesToRender(mockTileLayers, false);
        const ids = getUniqueIds(res);
        expect(ids).to.not.include(RoadInspectionJobId);
      });
      it('must contain jobId 0 for inspection job geometry', () => {
        const res = getTileLayerFeaturesToRender(mockTileLayers, false);
        const inspectionJobGeometry = res.find(
          ({ properties }) => properties.hash === 'DDD',
        );
        expect(inspectionJobGeometry.properties.jobId).to.eq(0);
      });
      it('must not contain duplicate hashes', () => {
        const res = getTileLayerFeaturesToRender(mockTileLayers, false);
        expect(hasDuplicateHashes(res)).to.eq(false);
      });
    });

    describe('inspection jobs', () => {
      it('must not contain other non-zero jobIds than inspection job', () => {
        const res = getTileLayerFeaturesToRender(mockTileLayers, true);
        const ids = getUniqueIds(res);
        ids.forEach(id => expect([0, RoadInspectionJobId]).to.include(id));
      });
      it('must contain jobId 0 for all other geometries than inspection', () => {
        const res = getTileLayerFeaturesToRender(mockTileLayers, true);
        const otherJobGeometries = res.filter(
          ({ properties }) => properties.hash !== 'DDD',
        );
        otherJobGeometries.forEach(({ properties }) => {
          expect(properties.jobId).to.eq(0);
        });
      });
      it('must not contain duplicate hashes', () => {
        const res = getTileLayerFeaturesToRender(mockTileLayers, true);
        expect(hasDuplicateHashes(res)).to.eq(false);
      });
    });
  });
});

import { expect } from 'chai';
import { describe, it } from 'mocha';

import trimRouteId, {
  isNumberVariant,
  isRailRoute,
  isSubwayRoute,
} from '../../app/util/domain';

describe('domain', () => {
  describe('trimRouteId', () => {
    it('should parse a rail route', () => {
      expect(trimRouteId('3002L')).to.equal('L');
    });

    it('should parse a rail route with a number variant', () => {
      expect(trimRouteId('3002U6')).to.equal('U');
    });

    it('should parse a subway route', () => {
      expect(trimRouteId('31M1')).to.equal('M1');
      expect(trimRouteId('31M2')).to.equal('M2');
    });

    it('should parse a bus route', () => {
      expect(trimRouteId('1052')).to.equal('52');
      expect(trimRouteId('1092N')).to.equal('92N');
      expect(trimRouteId('4611')).to.equal('611');
      expect(trimRouteId('9787A')).to.equal('787A');
      expect(trimRouteId('9788KV')).to.equal('788KV');
    });

    it('should parse a bus route with a number variant', () => {
      expect(trimRouteId('9787A3')).to.equal('787A');
    });
  });

  describe('isNumberVariant', () => {
    it('should flag a rail route with a number variant', () => {
      expect(isNumberVariant('3002U6')).to.equal(true);
    });

    it('should not flag a subway route', () => {
      expect(isNumberVariant('31M1')).to.equal(false);
      expect(isNumberVariant('31M2')).to.equal(false);
    });
  });

  describe('isRailRoute', () => {
    it('should flag a rail route with a number variant', () => {
      expect(isRailRoute('3002U6')).to.equal(true);
    });
  });

  describe('isSubwayRoute', () => {
    it('should flag a subway route', () => {
      expect(isSubwayRoute('31M1')).to.equal(true);
      expect(isSubwayRoute('31M2')).to.equal(true);
    });
  });
});

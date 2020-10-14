import { expect } from 'chai';
import { describe, it } from 'mocha';

import { getSortedItems } from '../../../app/util/bicycleRouteUtils';

describe('bicycleRouteUtils', () => {
  describe('getSortedItems', () => {
    it('maps bicycle route item to correct object shape', () => {
      const items = {
        BAANA: {
          color: '#FFFFFF',
          dashed: true,
        },
      };
      const res = getSortedItems(items);
      expect(res[0]).to.deep.equal({
        type: 'BAANA',
        color: '#FFFFFF',
        dashed: true,
      });
    });
    it('sorts items according to constants.BicycleRouteLinePriorities - no unknown keys', () => {
      const items = {
        'BRAND-MAIN': {
          color: '#FFFFFF',
          dashed: true,
        },
        'BAANA-PLANNED': {
          color: '#FFFFFF',
          dashed: true,
        },
        'TYPES-ACCESS_ROAD': {
          color: '#FFFFFF',
          dashed: true,
        },
        'BAANA-CURRENT': {
          color: '#FFFFFF',
          dashed: true,
        },
      };
      const res = getSortedItems(items);
      expect(res[0].type).to.equal('BAANA-CURRENT');
      expect(res[1].type).to.equal('BAANA-PLANNED');
      expect(res[2].type).to.equal('BRAND-MAIN');
      expect(res[3].type).to.equal('TYPES-ACCESS_ROAD');
    });

    it('sorts items according to constants.BicycleRouteLinePriorities - unknown key to end', () => {
      const items = {
        'BRAND-MAIN': {
          color: '#FFFFFF',
          dashed: true,
        },
        '______QWERTY!1234': {
          color: '#FFFFFF',
          dashed: true,
        },
        'TYPES-ACCESS_ROAD': {
          color: '#FFFFFF',
          dashed: true,
        },
        'BAANA-CURRENT': {
          color: '#FFFFFF',
          dashed: true,
        },
      };
      const res = getSortedItems(items);
      expect(res[0].type).to.equal('BAANA-CURRENT');
      expect(res[1].type).to.equal('BRAND-MAIN');
      expect(res[2].type).to.equal('TYPES-ACCESS_ROAD');
      expect(res[3].type).to.equal('______QWERTY!1234');
    });

    it('sorts items according to constants.BicycleRouteLinePriorities - several unknown keys to end', () => {
      const items = {
        '______FOOBARERER+': {
          color: '#FFFFFF',
          dashed: true,
        },
        '______QWERTY!1234': {
          color: '#FFFFFF',
          dashed: true,
        },
        'TYPES-ACCESS_ROAD': {
          color: '#FFFFFF',
          dashed: true,
        },
        '______BUZZFIZZ?': {
          color: '#FFFFFF',
          dashed: true,
        },
        'MAIN_REGIONAL-REGIONAL': {
          color: '#FFFFFF',
          dashed: true,
        },
        'BAANA-CURRENT': {
          color: '#FFFFFF',
          dashed: true,
        },
      };
      const res = getSortedItems(items);
      expect(res[0].type).to.equal('BAANA-CURRENT');
      expect(res[1].type).to.equal('MAIN_REGIONAL-REGIONAL');
      expect(res[2].type).to.equal('TYPES-ACCESS_ROAD');
    });
  });
});

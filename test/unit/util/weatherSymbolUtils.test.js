import { expect } from 'chai';
import { describe, it } from 'mocha';
import formatWeatherSymbol from '../../../app/util/weatherSymbolUtils';

describe('weatherSymbolUtils', () => {
  describe('formatWeatherSymbol', () => {
    it('returns formatted weather symbol code', () => {
      const codes = [
        '100',
        '101',
        '102',
        '110',
        '111',
        '112',
        '122',
        '130',
        '131',
        '132',
        '140',
        '141',
        '142',
      ];
      codes.forEach(code => {
        expect(formatWeatherSymbol(`d${code}`)).equal('d100');
        expect(formatWeatherSymbol(`n${code}`)).equal('n100');
      });
    });

    it('returns unformatted weather symbol code', () => {
      expect(formatWeatherSymbol('d100')).equal('d100');
      expect(formatWeatherSymbol('n100')).equal('n100');
      expect(formatWeatherSymbol('n240')).equal('n240');
      expect(formatWeatherSymbol('n210')).equal('n210');
      expect(formatWeatherSymbol('d431')).equal('d431');
      expect(formatWeatherSymbol('d600')).equal('d600');
      expect(formatWeatherSymbol('n600')).equal('n600');
    });
  });
});

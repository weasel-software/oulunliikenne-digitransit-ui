import PropTypes from 'prop-types';
import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { spy } from 'sinon';

import { mockContext, mockChildContextTypes } from './helpers/mock-context';
import { mountWithIntl } from './helpers/mock-intl-enzyme';
import DTSearchAutosuggest from '../../app/component/DTSearchAutosuggest';

describe('<DTSearchAutosuggest />', () => {
  it('should trigger executeSearch function when input changes or is clicked', () => {
    const executeSearchSpy = spy();
    const props = {
      autoFocus: true,
      id: 'origin',
      layers: [],
      placeholder: 'search-origin',
      refPoint: {},
      searchType: 'all',
      selectedFunction: () => {},
      executeSearch: executeSearchSpy,
    };
    const wrapper = mountWithIntl(<DTSearchAutosuggest {...props} />, {
      context: { ...mockContext, config: {} },
      childContextTypes: {
        ...mockChildContextTypes,
        config: PropTypes.object,
      },
    });

    const input = wrapper.find('input');
    input.simulate('click');
    expect(executeSearchSpy.calledOnce).to.equal(true);

    input.simulate('change', { target: { value: ' ' } });
    expect(executeSearchSpy.calledTwice).to.equal(true);
  });
});

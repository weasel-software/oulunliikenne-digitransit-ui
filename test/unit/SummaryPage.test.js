import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
  createRelayMockContext,
  mockChildContextTypes,
} from './helpers/mock-context';
import { mountWithIntl } from './helpers/mock-intl-enzyme';
import MUITheme from '../../app/MuiTheme';
import * as SummaryPage from '../../app/component/SummaryPage';
import config from '../../app/configurations/config.default';

describe('SummaryPage', () => {
  it('should render', () => {
    const props = {
      from: {
        lat: 60.19948,
        lon: 24.939067,
        address: 'Koti',
      },
      location: {
        state: {},
        query: {},
      },
      params: {
        from: 'Koti::60.19948,24.939067',
        to: 'Aleksanterinkatu 0404, Helsinki::60.16893,24.94613',
      },
      plan: {
        plan: {},
      },
      routes: [{}, {}],
      to: {
        lat: 60.16893,
        lon: 24.94613,
        address: 'Aleksanterinkatu 0404, Helsinki',
      },
    };

    mountWithIntl(<SummaryPage.default {...props} />, {
      context: {
        ...createRelayMockContext(),
        config: config,
        location: {
          query: {
            arriveBy: 'false',
            time: '1527165898',
          },
        },
        muiTheme: getMuiTheme(MUITheme(config)),
        queryAggregator: {
          readyState: {
            done: true,
            error: undefined,
          },
        },
        router: {
          createHref: () => {},
          listen: () => {},
        },
      },
      childContextTypes: {
        ...mockChildContextTypes,
        ...SummaryPage.contextTypes,
        muiTheme: PropTypes.object,
      },
    });
  });
});

import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';
import Card from '../../Card';
import CardHeader from '../../CardHeader';
import MarkerPopupBottom from '../MarkerPopupBottom';
import { getLabel } from '../../../util/suggestionUtils';
import { getJson } from '../../../util/xhrPromise';
import Loading from '../../Loading';
import addDigitransitAuthParameter from '../../../util/authUtils';

class LocationPopup extends React.Component {
  static contextTypes = {
    config: PropTypes.object.isRequired,
    getStore: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  static propTypes = {
    name: PropTypes.string.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      location: {
        lat: this.props.lat,
        lon: this.props.lon,
      },
    };
  }

  componentDidMount() {
    const language = this.context.getStore('PreferencesStore').getLanguage();
    const url = addDigitransitAuthParameter(
      this.context.config,
      this.context.config.URL.PELIAS_REVERSE_GEOCODER,
    );
    getJson(url, {
      'point.lat': this.props.lat,
      'point.lon': this.props.lon,
      'boundary.circle.lat': this.props.lat,
      'boundary.circle.lon': this.props.lon,
      'boundary.circle.radius': 0.1, // 100m
      'digitransit-subscription-key': this.context.config.SUBSCRIPTION_KEY,
      lang: language,
      size: 1,
      layers: 'address',
    }).then(
      data => {
        if (data.features != null && data.features.length > 0) {
          const match = data.features[0].properties;
          this.setState({
            loading: false,
            location: {
              ...this.state.location,
              address: getLabel(match),
            },
          });
        } else {
          this.setState({
            loading: false,
            location: {
              ...this.state.location,
              address: this.context.intl.formatMessage({
                id: 'location-from-map',
                defaultMessage: 'Selected location',
              }),
            },
          });
        }
      },
      () => {
        this.setState({
          loading: false,
          location: {
            address: this.context.intl.formatMessage({
              id: 'location-from-map',
              defaultMessage: 'Selected location',
            }),
          },
        });
      },
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="card smallspinner" style={{ height: '4rem' }}>
          <Loading />
        </div>
      );
    }
    return (
      <Card>
        <div className="padding-small">
          <CardHeader
            name={this.state.location.address}
            description={this.props.name}
            unlinked
            className="padding-small"
          />
        </div>
        <MarkerPopupBottom location={this.state.location} />
      </Card>
    );
  }
}

export default LocationPopup;

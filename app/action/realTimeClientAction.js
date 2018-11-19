import ceil from 'lodash/ceil';
import moment from 'moment';

const AWS = require('aws-sdk');
const iot = require('aws-iot-device-sdk');

const modeTranslate = {
  train: 'rail',
};

// getTopic
// Returns MQTT topic to be subscribed
// Input: options - route, direction, tripStartTime are used to generate the topic
function getTopic(options) {
  const routeId = options.route ? options.route : '+';

  // MQTT topic cannot have more than 7 forward slashes in AWS IoT, so for oulunliikenne we use a shorter version than HSL.
  // Also, we don't have any other data anyways, so we don't lose anything.
  // /hfp/<version>/journey/<temporal_type>/<transport_mode>/<vehicle_number>/<route_id>
  return `/hfp/v1/journey/ongoing/+/+/${routeId}`;
}

export function parseMessage(topic, message, actionContext) {
  let parsedMessage;
  const [
    ,
    ,
    ,
    ,
    ,
    transportMode,
    // operatorId,
    vehicleNumber,
    routeId,
    // directionId,
    // headsign,
    // startTime,
    // nextStop,
    // geohashLevel,
    // geohash,
  ] = topic.split('/');

  if (message instanceof Uint8Array) {
    parsedMessage = JSON.parse(message).VP;
  } else {
    parsedMessage = message.VP;
  }

  const messageContents = {
    id: vehicleNumber,
    route: `OULU:${routeId}`,
    direction: 0, // we don't have this data
    tripStartTime: '', // we don't have this data
    operatingDay:
      parsedMessage.oday && parsedMessage.oday !== 'XXX'
        ? parsedMessage.oday
        : moment().format('YYYY-MM-DD'),
    mode: modeTranslate[transportMode]
      ? modeTranslate[transportMode]
      : transportMode,
    next_stop: parsedMessage.nxt,
    stop_index: parsedMessage.stop_index,
    timestamp: parsedMessage.tsi,
    lat: parsedMessage.lat && ceil(parsedMessage.lat, 5),
    long: parsedMessage.long && ceil(parsedMessage.long, 5),
    heading: parsedMessage.hdg,
  };

  actionContext.dispatch('RealTimeClientMessage', {
    id: vehicleNumber,
    message: messageContents,
  });
}

export function startRealTimeClient(actionContext, originalOptions, done) {
  const options = !Array.isArray(originalOptions)
    ? [originalOptions]
    : originalOptions;

  const topics = options.map(option => getTopic(option));

  // Initialize the Amazon Cognito credentials provider with an unauthenticated user to get access to MQTT broker.
  // The unauthenticated user role is given access to `connect` to the MQTT broker and `subscribe` to topics.
  AWS.config.region = actionContext.config.AWS.region;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: actionContext.config.AWS.iot.cognito.identityPoolId,
  });
  AWS.config.credentials.clearCachedId();
  AWS.config.credentials.refresh(err => {
    if (!err) {
      // Each MQTT client needs a unique ID. Any duplicate ID will cause clients to disconnect.
      const rand = Math.floor(Math.random() * 100000 + 1);
      const client = iot.device({
        protocol: 'wss',
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        clientId: `mqtt-${rand}`,
        host: actionContext.config.URL.MQTT,
      });

      client.on('connect', () => client.subscribe(topics));
      // client.on('error', e => console.log(e));
      client.on('message', (t, m) => parseMessage(t, m, actionContext));

      actionContext.dispatch('RealTimeClientStarted', { client, topics });
    }
    done();
  });
}

export function updateTopic(actionContext, options, done) {
  options.client.unsubscribe(options.oldTopics);

  const newTopics = !Array.isArray(options.newTopic)
    ? [getTopic(options.newTopic)]
    : options.newTopic.map(topic => getTopic(topic));

  options.client.subscribe(newTopics);
  actionContext.dispatch('RealTimeClientTopicChanged', newTopics);

  done();
}

export function stopRealTimeClient(actionContext, client, done) {
  client.end();
  actionContext.dispatch('RealTimeClientStopped');
  done();
}

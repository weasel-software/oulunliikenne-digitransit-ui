import ceil from 'lodash/ceil';
import chunk from 'lodash/chunk';

const AWS = require('aws-sdk');
const iot = require('aws-iot-device-sdk');

export const ROUTE_TYPE_MOTORISED_TRAFFIC = 'motorised-traffic';
export const ROUTE_TYPE_NON_MOTORISED_TRAFFIC = 'non-motorised-traffic';

function getTopic(type) {
  const routeType = type || '+';

  return `/hfp/v1/harja/${routeType}/+`;
}

export function parseMessage(topic, message, actionContext) {
  let parsedMessage;

  if (message instanceof Uint8Array) {
    parsedMessage = JSON.parse(message);
  } else {
    parsedMessage = message;
  }

  const messageContents = {
    id: parsedMessage.vid,
    jobIds: parsedMessage.jid,
    timestamp: parsedMessage.tsi,
    lat: parsedMessage.lat && ceil(parsedMessage.lat, 5),
    long: parsedMessage.lon && ceil(parsedMessage.lon, 5),
    dir: parsedMessage.dir,
  };

  actionContext.dispatch('MaintenanceVehicleRealTimeClientMessage', {
    id: messageContents.id,
    message: messageContents,
  });

  actionContext.dispatch('MaintenanceVehicleTailAdd', messageContents);
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
    IdentityPoolId: actionContext.config.AWS.iot.identityPoolId,
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

      client.on('connect', () => {
        // A single SUBSCRIBE request is limited a maximum of eight subscriptions. So we need to subscribe in chunks of max 8
        const topicsChunkList = chunk(topics, 8);
        topicsChunkList.forEach(topicsChunk => client.subscribe(topicsChunk));
      });

      // client.on('error', e => console.log(e));
      // client.on('close', () => console.log('Client connection closed'));
      client.on('message', (t, m) => parseMessage(t, m, actionContext));

      actionContext.dispatch('MaintenanceVehicleRealTimeClientStarted', {
        client,
        topics,
      });
    }
    done();
  });
}

export function updateTopic(actionContext, options, done) {
  options.client.unsubscribe(options.oldTopics);

  const newTopics = [getTopic(options.newTopic)];
  options.client.subscribe(newTopics);
  actionContext.dispatch(
    'MaintenanceVehicleRealTimeClientTopicChanged',
    newTopics,
  );

  done();
}

export function stopRealTimeClient(actionContext, client, done) {
  client.end();
  actionContext.dispatch('MaintenanceVehicleRealTimeClientStopped');
  done();
}

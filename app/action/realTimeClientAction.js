import startMqttClient from '../util/mqttClient';
import {
  startRealTimeClient as startMqttClientAlt,
  changeTopics as changeTopicsAlt,
} from '../util/mqttClientAlt';
import startGtfsRtHttpClient from '../util/gtfsRtHttpClient';

export function startRealTimeClient(actionContext, settings, done) {
  let startClient;
  if (settings.useAltRealtimeClient) {
    startClient = startMqttClientAlt;
  } else if (settings.mqtt) {
    startClient = startMqttClient;
  } else {
    startClient = startGtfsRtHttpClient;
  }

  startClient(settings, actionContext).then(data => {
    actionContext.dispatch('RealTimeClientStarted', data);
    done();
  });
}

export function stopRealTimeClient(actionContext, client, done) {
  client.end();
  actionContext.dispatch('RealTimeClientStopped');
  done();
}

export function changeRealTimeClientTopics(actionContext, settings, done) {
  console.log('settings', settings);
  if (settings.useAltRealtimeClient) {
    changeTopicsAlt(settings, actionContext);
  }
  done();
}

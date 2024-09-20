ARG DOCKER_IMAGE=node:18
FROM $DOCKER_IMAGE

EXPOSE 8080

ENV \
  # Where the app is built and run inside the docker fs \
  WORK=/opt/digitransit-ui \
  # Used indirectly for saving npm logs etc. \
  HOME=/opt/digitransit-ui \
  # App specific settings to override when the image is run \
  SENTRY_DSN='' \
  SENTRY_SECRET_DSN='' \
  PORT=8080 \
  API_URL='' \
  MAP_URL='' \
  MQTT_URL='' \
  OTP_URL='' \
  ALERTS_URL='' \
  VEHICLE_URL='' \
  GEOCODING_BASE_URL='' \
  APP_PATH='' \
  CONFIG='' \
  PIWIK_ADDRESS='' \
  PIWIK_ID='' \
  NODE_ENV='' \
  NODE_OPTS='' \
  RELAY_FETCH_TIMEOUT='' \
  ASSET_URL='' \
  AWS_REGION='' \
  AWS_MAP_URL='' \
  AWS_IDENTITY_POOL_ID=''

# Set the PORT environment variable
ENV PORT=8080

WORKDIR ${WORK}
ADD . ${WORK}

RUN \
  yarn install --silent && \
  yarn run build && \
  rm -rf static docs test /tmp/* && \
  yarn cache clean

CMD yarn run start

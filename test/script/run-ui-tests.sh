#!/bin/bash

# Enable for debugging
# set -e
# set -x

clear
echo "Running ui-tests: $1"
echo "***************************"

PLATFORM=`uname`
if [ $PLATFORM == 'Darwin' ]; then
  SELENIUM_URL=https://selenium-release.storage.googleapis.com/2.48/selenium-server-standalone-2.48.2.jar
  BROWSERSTACK_LOCAL_URL="https://www.browserstack.com/browserstack-local/BrowserStackLocal-darwin-x64.zip"
else
  SELENIUM_URL=https://selenium-release.storage.googleapis.com/2.48/selenium-server-standalone-2.48.2.jar
  BROWSERSTACK_LOCAL_URL="https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip"
fi

NIGHTWATCH_BINARY="./node_modules/nightwatch/bin/nightwatch"
BROWSERSTACK_LOCAL_BINARY="./test/binaries/BrowserStackLocal"
SELENIUM_BINARY="./test/binaries/selenium-server-standalone-2.48.2.jar"

# checks for dependencies and downloads them if needed
function checkDependencies {
  mkdir -p ./test/binaries
  if [ ! -f $SELENIUM_BINARY ]; then
    echo "Downloading Selenium..."
    curl -o $SELENIUM_BINARY $SELENIUM_URL
  fi

  if [ ! -f $BROWSERSTACK_LOCAL_BINARY ]; then
    echo "Downloading BrowserStackLocal..."
    curl -o $BROWSERSTACK_LOCAL_BINARY.zip $BROWSERSTACK_LOCAL_URL
    unzip $BROWSERSTACK_LOCAL_BINARY.zip
    mv BrowserStackLocal $BROWSERSTACK_LOCAL_BINARY
  fi
}

# Kills process tree
killtree() {
  local _pid=$1
  kill -stop ${_pid} # needed to stop quickly forking parent from producing children between child killing and parent killing
  # TODO: Does not work with OSX
  #for _child in $(ps -o pid --no-headers --ppid ${_pid}); do
  # killtree ${_child}
  #done
  kill -TERM ${_pid}
}

checkDependencies

if [ "$1" == "local" ]; then
  npm run dev &
  NODE_PID=$!
  # Wait for the server to start
  sleep 10
  # Then run tests
  $NIGHTWATCH_BINARY -c ./test/config/nightwatch.json
  NIGHTWATCH_PID=$!
  # Kill Node and Nightwatch
  killtree $NODE_PID
  killtree $NIGHTWATCH_PID

elif [ "$1" == "browserstack" ]; then
  npm run dev &
  NODE_PID=$!
  $BROWSERSTACK_LOCAL_BINARY $3 &
  BROWSERSTACK_PID=$!
  # Wait for the server to start
  sleep 10
  # Then run tests
  env BROWSERSTACK_USER=$2 BROWSERSTACK_KEY=$3 $NIGHTWATCH_BINARY -c ./test/config/nightwatch.json -e bs-fx,bs-chrome,bs-iphone
  NIGHTWATCH_PID=$!
  # Kill Node, Browserstack, and Nightwatch
  killtree $NODE_PID
  killtree $BROWSERSTACK_PID
  killtree $NIGHTWATCH_PID
else
  echo "Please specify environment. 'local' or 'browserstack'"
fi

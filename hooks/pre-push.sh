#!/bin/sh

PATH=$PATH:/usr/local/bin:/usr/local/sbin

set -e
set -x

npm run test-local

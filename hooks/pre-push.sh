#!/bin/sh

# This fixes the issue when SourceTree runs the hooks and doens't find npm.
PATH=$PATH:/usr/local/bin:/usr/local/sbin

set -e
set -x

npm run test-unit

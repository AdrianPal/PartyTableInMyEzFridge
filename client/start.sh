#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
SRC="$DIR"

cd "$SRC"

cd TUIOClient && npm run develop & cd TUIOManager && npm run devMode & cd TUIOSamples && npm run start

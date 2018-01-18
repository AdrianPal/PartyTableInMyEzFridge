#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
SRC="$DIR/../"

cd "$SRC"

mkdir -p ./data/db && mongod --dbpath ./data/db
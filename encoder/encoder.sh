#!/bin/bash

ROOT=$(pwd)
NODE=$(which node)
SCRIPT=src/index.js
OPTS=s

$NODE $ROOT/$SCRIPT -$OPTS

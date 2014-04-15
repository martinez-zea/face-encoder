#!/bin/bash

NODE=$(which node)
SCRIPT=/home/pi/face-encoder/src/index.js
OPTS=s

$NODE $SCRIPT -$OPTS

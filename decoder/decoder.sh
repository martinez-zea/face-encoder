#!/bin/bash

NODE=$(which node)
SCRIPT=/home/pi/face-encoder/decoder/src/index.js
OPTS=s

$NODE $SCRIPT -$OPTS

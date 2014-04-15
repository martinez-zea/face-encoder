#! /bin/sh

### BEGIN INIT INFO
# Provides:          encoder
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Simple script to start a program at boot
# Description:       A simple script from www.stuffaboutcode.com which will start / stop a program a boot / shutdown.
### END INIT INFO

# If you want a command to always run, put it here

# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "--------- Starting Encoder ---------"
    # run application you want to start
    echo "`/bin/date` $1" >> /home/pi/encoder.log
    #/home/pi/face-encoder/decoder/decoder.sh >> /home/pi/decoder.log &
    /usr/local/bin/node /home/pi/face-encoder/encoder/src/index.js -s >> /home/pi/decoder.log &
    ;;
  stop)
    echo "--------- Stoping Decoder ---------"
    # kill application you want to stop
    killall encoder.sh
    killall node
    ;;
  *)
    echo "Usage: /etc/init.d/encoder.sh {start|stop}"
    exit 1
    ;;
esac

exit 0

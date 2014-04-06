// # Global configuration
module.exports = {
  SERVER_PORT : 3000,
  // local USB port
  SERIAL_PORT : "/dev/tty.usbmodem1421",
  // pins and speed of the motor
  MOTOR_PWM : 9,
  MOTOR_DIRECTION : 8,
  FORWARD_SPEED : 200, //really slow, it's inverted
  REVERSE_SPEED : 255,
  // buttons
  FRONT_PIN : 7,
  BACK_PIN : 4,
  START_PIN : 2,
  // Sensosr
  ANALOG_PIN : 'A0',
  FREQ : 10
}

// # Global configuration
// Constants required in different parts of the software
module.exports = {
  // port to use by the local server
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
  // Sensor
  ANALOG_PIN : 'A0',
  FREQ : 250,
  // Maximum numbers of readigs to filter
  MAX_SAMPLES : 20,
  // Maximum number of samples to learn
  TO_LEARN : 2000
}

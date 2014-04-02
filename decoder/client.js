var socket = io.connect('http://localhost:3000');

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

socket.on('board', function (data) {
  console.info(data)
  $("#status").text(data.status)
});

socket.on('sensor', function (data) {
  //console.info(data)
  $("#sensor_raw").text(data.raw)
  $("#sensor_average").text(data.smooth)

  var raw = Math.round( data.raw );
  var raw_col = rgbToHex(raw,raw,raw);
  //console.log(col)

  var average = Math.round( data.smooth );
  var average_col = rgbToHex(average,average,average);

  $("#vis_raw").css("background-color", raw_col)
  $("#vis_average").css("background-color", average_col)
});

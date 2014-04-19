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

socket.on('measure', function (data) {
  console.log("data",data)
  _.forEach(data, function (item, key){
    $('#'+key).css('background-color', item.color)
  })
});


$(function () {
  $(document).ready(function(){
    $('.loading').spin('large', '#000000')
  })
})

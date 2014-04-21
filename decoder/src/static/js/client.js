'use strict';

var socket = io.connect('http://localhost:3000');

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function writePixels(colors){
  $('.pixels').each(function(index, colors){
    console.log('writing color: ' + colors[index]);
    $(this).css('background-color', colors[index]);
  });
}

socket.on('board', function (data) {
  //console.info(data)
  $('#status').text(data.status)
});

socket.on('measure', function (data) {
  //console.log('measure data',data)
  _.forEach(data, function (item, key){
    $('#'+key).css('background-color', item.color)
  })
});

socket.on('status', function (data){
  console.info('status data', data)

  if(data.board === 'calibrating'){
    window.location = 'http://localhost:3000'
  }

  if(data.board === 'scanning'){
   window.location = 'http://localhost:3000/scanning'
  }

  if(data.board === 'portrait'){
    window.location = 'http://localhost:3000/portrait'
  }
})


$(document).ready(function(){
  $('.loading').spin('large', '#000000')
  $('.bxslider').bxSlider({
    auto: true,
    controls: false,
    autoContols: false,
  });
})

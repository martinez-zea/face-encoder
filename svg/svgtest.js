var svg = require('paths-js/path');

var path = svg()

var points = new Array() 

function randInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


path.moveto(0,0).lineto(0,1)

for (var i = 0 ; i >= 255; i++) {
	var x = i * 5
	var y = randInt(1, 5)
	path.lineto(x,y)
};

path.lineto(0,0)


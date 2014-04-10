// # Portrait
// this module reads the pixel data from the given image to extract the data and
// return it in an array
// ## dependences
// pngjs is used to decode and analyze the picture
var fs = require('fs'),
  PNG = require('pngjs').PNG,
  chalk = require('chalk')

// # Extract
// Descode the png to get the pixel data of the image
var extract = function (input, callback) {
  // where to store the data
  var portrait = []

  // initialize the PNGdecoder
  fs.createReadStream(input)
    .pipe(new PNG({
        //filterType: 4
    }))
    // when the decode is done
    .on('parsed', function() {
        // walk thru the pixels
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
                // put the value into the pixel
                portrait.push(this.data[idx])
            }
        }
        console.log( chalk.green("Image color extraction done! ") )
        // return the data when done
        callback(portrait)
    });
}

module.exports.extract = extract

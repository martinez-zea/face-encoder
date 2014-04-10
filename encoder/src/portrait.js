var fs = require('fs'),
  PNG = require('pngjs').PNG,
  chalk = require('chalk')

var extract = function (input, callback) {
  var portrait = []

  fs.createReadStream(input)
    .pipe(new PNG({
        //filterType: 4
    }))
    .on('parsed', function() {

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;

                portrait.push(this.data[idx])
            }
        }
        console.log( chalk.green("Image color extraction done! ") )
        callback(portrait)
    });
}

module.exports.extract = extract

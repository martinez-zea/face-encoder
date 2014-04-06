var brain = require("brain")

// heights of the object
var height = {
  EMPTY : 0,
  FIVE : 0.1,
  TEN : 0.2,
  FIVETEEN : 0.4,
  TWENTY : 0.5,
  TWENTY_FIVE : 0.7,
  THIRTY : 0.8,
  FINISH : 1
}

// # Classifier
// train the classifier with some data of the height ranges available in the
// physical object
var heightClassifier = new brain.NeuralNetwork()


var train = function () {
  // Initial data for the trainer
heightClassifier.train([
  // case: no object
  {input: [0.29657869012707727], output: [height.EMPTY]},
  {input: [0.29599217986314763], output: [height.EMPTY]},
  {input: [0.2954708374063213], output: [height.EMPTY]},
  {input: [0.2956011730205279], output: [height.EMPTY]},

  // case: base of object
  {input: [0.25304659498207877], output: [height.FIVE]},
  {input: [0.2534376018246985], output: [height.FIVE]},
  {input: [0.25298142717497546], output: [height.FIVE]},
  {input: [0.2532420984033886], output: [height.FIVE]},

  // // case: 10mm -- first important data
  {input: [0.22163571195829251], output: [height.TEN]},
  {input: [0.22222222222222215], output: [height.TEN]},
  {input: [0.22319973932877152], output: [height.TEN]},
  {input: [0.22137504072987937], output: [height.TEN]},

  // // case 15mm
  {input: [0.1975887911371782], output: [height.FIVETEEN]},
  {input: [0.19771912675138478], output: [height.FIVETEEN]},
  {input: [0.19824046920821112], output: [height.FIVETEEN]},
  {input: [0.1983056370153144], output: [height.FIVETEEN]},

  // // case: 20mm
  {input: [0.1818833496252851], output: [height.TWENTY]},
  {input: [0.18194851743238838], output: [height.TWENTY]},
  {input: [0.18344737699576408], output: [height.TWENTY]},
  {input: [0.1847507331378299], output: [height.TWENTY]},

  // // case: 25mm
  {input: [0.1517758227435647], output: [height.TWENTY_FIVE]},
  {input: [0.15066797002280874], output: [height.TWENTY_FIVE]},
  {input: [0.14923427826653635], output: [height.TWENTY_FIVE]},
  {input: [0.1489084392310199], output: [height.TWENTY_FIVE]},

  // // case: 30mm
  {input: [0.13027044639947863], output: [height.THIRTY]},
  {input: [0.1303356142065819], output: [height.THIRTY]},
  {input: [0.1289019224503095], output: [height.THIRTY]},
  {input: [0.12903225806451607], output: [height.THIRTY]},

  // // case: 35mm
  // {input: [149.0], output: [height.FINAL]},
  // {input: [130.0], output: [height.FINAL]},
  // {input: [100.0], output: [height.FINAL]}
])
}

var guess = function (data){
  return heightClassifier.run([data])
}


module.exports.height = height
module.exports.heightClassifier = heightClassifier
module.exports.train = train
module.exports.guess = guess

var _ = require('lodash');

var randomLength = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.toneRow = {
  c: 0,
  cis: 1,
  d: 2,
  dis: 3,
  e: 4,
  f: 5,
  fis: 6,
  g: 7,
  gis: 8,
  a: 9,
  ais: 10,
  b: 11
};


exports.shuffle = (array) => {
  var counter = array.length, temp, index;

  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;

    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

exports.randomScale = () => {
  var notesArray = ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'b'];
  var scale = _.chain(notesArray)
          .sample(randomLength(3, 6))
          .value();

  return _.sortBy(scale, function(note) {
    return exports.toneRow[note];
  });
}

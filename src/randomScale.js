var _ = require('lodash');
var toneRow = require('./toneRow');

var randomLength = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.randomScale = function() {
  var notesArray = ["c", "cis", "d", "dis", "e", "f", "fis", "g", "gis", "a", "ais", "b"];
  var scale = _.chain(notesArray)
          .sample(randomLength(3, 6))
          .value();

  return _.sortBy(scale, function(note) {
    return toneRow[note];
  });
}

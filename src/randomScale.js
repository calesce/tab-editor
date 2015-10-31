var _ = require('lodash');
var toneRow = require('./toneRow');

var randomLength = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.randomScale = function() {
  var notesArray = ["c", "cis", "d", "dis", "e", "f", "fis", "g", "gis", "a", "ais", "b"];
  return _.chain(notesArray)
          .sample(randomLength(1, 12))
          /*.sortBy(toneRow, function(note) {
            return toneRow[note];
          })*/
          .value();
}

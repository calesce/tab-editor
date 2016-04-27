import xmldoc from 'xmldoc';

const instrumentsFromMusicXml = partList => {
  return partList.children.map(part => {
    // TODO handle instruments better, defaulting to acoustic guitar
    return 'acoustic_guitar_steel';
    //return part.childNamed('score-instrument').children[0].val.replace('Steel String Guitar', 'acoustic_guitar_steel');
  });
};

const getTuning = (part, maker) => {
  const staff = part.childNamed('measure').childNamed('attributes').childNamed('staff-details');

  return staff.children.slice(1).map(string => {
    const note = string.children[0].val;
    const octave = parseInt(string.children[1].val);
    return (`${note}${maker === 'TuxGuitar' ? octave - 1 : octave}`).toLowerCase();
  });
};

const getBpmForMeasure = (measures, measure, index) => {
  const direction = measure.childNamed('direction');
  if(direction) {
    return parseInt(direction.childNamed('sound').attr.tempo);
  } else {
    return measures[index - 1].bpm ? measures[index - 1].bpm : 120;
  }
};

const getTimeSignatureForMeasure = (measures, measure, index) => {
  const attributes = measure.childNamed('attributes');
  if(attributes) {
    const time = attributes.childNamed('time');
    if(time) {
      const beats = time.childNamed('beats').val;
      const beatType = time.childNamed('beat-type').val;
      return `${beats}/${beatType}`;
    }
  }

  return measures[index - 1].timeSignature ? measures[index - 1].timeSignature : '6/8';
};

const getNotesForMeasure = (notes, stringCount) => {
  return notes.reduce((finalNotes, note) => {
    const duration = note.childNamed('type').val.substring(0, 1);
    const dotted = note.childNamed('dot') ? true : false;
    const isChord = note.childNamed('chord') ? true : false;

    const fret = parseInt(note.childNamed('notations').childNamed('technical').childNamed('fret').val);
    const string = stringCount - parseInt(note.childNamed('notations').childNamed('technical').childNamed('string').val);

    let frets, strings;
    if(isChord) {
      frets = finalNotes[finalNotes.length - 1].fret.concat(fret);
      strings = finalNotes[finalNotes.length - 1].string.concat(string);

      return finalNotes.slice(0, finalNotes.length - 1).concat({
        duration,
        fret: frets,
        string: strings,
        dotted
      });
    }

    frets = [fret];
    strings = [string];

    return finalNotes.concat({
      duration,
      fret: frets,
      string: strings,
      dotted
    });
  }, []);
};

const measuresFromMusicXml = (measures, stringCount) => {
  return measures.reduce((finalMeasures, measure, i) => {
    const bpm = getBpmForMeasure(finalMeasures, measure, i);
    const timeSignature = getTimeSignatureForMeasure(finalMeasures, measure, i);
    const notes = getNotesForMeasure(measure.childrenNamed('note'), stringCount);

   return finalMeasures.concat({
     bpm,
     timeSignature,
     notes
   });
 }, []);
};

export function importMusicXml(xmlString) {
  const xml = new xmldoc.XmlDocument(xmlString);
  const parts = xml.childrenNamed('part');

  const instruments = instrumentsFromMusicXml(xml.childNamed('part-list'));
  const maker = xml.childNamed('identification').childNamed('encoding').childNamed('software').val;

  return parts.reduce((finalParts, part, i) => {
    const instrument = instruments[i];
    const tuning = getTuning(part, maker);
    const measures = measuresFromMusicXml(part.childrenNamed('measure'), tuning.length);

    return finalParts.concat({
      instrument,
      tuning,
      measures
    });
  }, []);
}

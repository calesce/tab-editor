import { getBpmForNote, getPercentageOfNote, getDurationFromPercentage } from '../util/audioMath';

export const getReplaySpeed = (measure, noteIndex, lastNoteIndex) => {
  if(noteIndex === lastNoteIndex) {
    const speeds = measure[noteIndex].map(note => getBpmForNote(getDurationFromPercentage(1 - note.position, note.timeSignature), note.bpm));
    return Math.max(...speeds);
  }

  const nextPosition = Math.min(...measure[noteIndex + 1].map(note => note.position));
  const positionDiff = nextPosition - measure[noteIndex][0].position;

  const speeds = measure[noteIndex].map(note => getBpmForNote(getDurationFromPercentage(positionDiff, note.timeSignature), note.bpm));
  return Math.max(...speeds);
};

export const createScheduleForSong = (tracks) => {
  return tracks[0].measures.map((_, i) => {
    return createScheduleForMeasure(tracks, i);
  });
};

export const createScheduleForMeasure = (tracks, measureIndex) => {
  const annotatedMeasures = tracks.reduce((accum, track, trackIndex) => {
    const measure = track.measures[measureIndex];

    const noteBuckets = measure.notes.reduce((bucket, note, noteIndex) => {
      const percentage = getPercentageOfNote(note.duration, measure.timeSignature, note.dotted, note.tuplet);

      const noteToUse = {
        ...note,
        originalMeasureIndex: measure.measureIndex,
        originalNoteIndex: noteIndex,
        instrument: track.instrument,
        tuning: track.tuning,
        bpm: measure.bpm,
        timeSignature: measure.timeSignature,
        trackIndex,
        position: bucket.totalDuration,
        percentage
      };

      if(bucket.totalDuration + percentage > 1.0) {
        if(bucket.totalDuration < 1.0) { // Shorten the note
          const newPercentage = 1.0 - bucket.totalDuration;
          return {
            ...bucket,
            [(bucket.totalDuration).toString()]: {
              ...noteToUse,
              percentage: newPercentage
            },
            totalDuration: bucket.totalDuration + newPercentage
          };
        } else {
          return bucket;
        }
      }

      return {
        ...bucket,
        [(bucket.totalDuration).toString()]: noteToUse,
        totalDuration: bucket.totalDuration + percentage
      };
    }, { totalDuration: 0 });
    return accum.concat(noteBuckets);
  }, []);

  const scheduledMeasure = annotatedMeasures.reduce((accum, measure) => {
    Object.keys(measure).forEach(bucket => {
      if(bucket === 'totalDuration') {
        return accum;
      }
      if(accum[bucket]) {
        accum[bucket] = accum[bucket].concat(measure[bucket]);
      } else {
        accum[bucket] = [measure[bucket]];
      }
    });
    return accum;
  }, {});

  return Object.keys(scheduledMeasure).sort().map(timeSlot => {
    return scheduledMeasure[timeSlot];
  });
};

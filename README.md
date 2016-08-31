Guitar Tab Editor
=====================

### Try it Out
[calesce.github.io/tab-editor](https://calesce.github.io/tab-editor)

### Note
This is a work-in-progress and in active development, so expect frequent changes.

This uses the Web Audio API for playback. Thanks to [soundfont-player](https://github.com/danigb/soundfont-player) for making some standard MIDI soundfonts available as Web Audio Buffer nodes. The soundfonts will sound much better on Chrome/Firefox than Safari/Edge (because the former support .ogg, and for the latter I fall back to .mp3).

### Features
* Playback
  * with woodblock metronome
  * count-in
* Edit time signature
* Page and Linear layout
* Edit tuning
* Edit tempo
* Add/remove/select different tracks
* Select different instruments per track
* Repeats
* Dotted Notes
* Tuplets
* Vibrato, Tremolo and Trills (32nd notes)
* Export as JSON file (my custom format)
* Import MusicXML
* Drag-to-select ranges of notes/measures
* Cut / Copy / Paste both individual notes and multiple notes/measures
* Navigate cursor via clicking and arrows
* `⌘+a` or `ctrl+a` to select all notes
* Undo/Redo

### Development

Running the app is fairly straightforward with Node.js:

```
npm install
npm start
open http://localhost:3000
```

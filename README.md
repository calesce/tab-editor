Guitar Tab Editor
=====================

### Try it Out
[calesce.github.io/tab-editor](https://calesce.github.io/tab-editor)

### Note
This is a work-in-progress and in active development, so expect frequent changes.

This uses the Web Audio API for playback. Thanks to [soundfont-player](https://github.com/danigb/soundfont-player) for making some standard MIDI soundfonts available as Web Audio Buffer nodes. The soundfonts will sound much better on Chrome/Firefox than Safari/Edge (because the former support .ogg, and for the latter I fall back to .mp3).

### Development

Running the app is fairly straightforward with Node.js:

```
npm install
npm start
open http://localhost:3000
```

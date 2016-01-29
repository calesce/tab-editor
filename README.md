Tab Editor
=====================

### Try it Out
[calesce.github.io/tab-editor](https://calesce.github.io/tab-editor)

### Note
This is *very* much a work-in-progress and largely incomplete. I haven't come up with a good design for the actual editor just yet, hence the unstyled/ugly ```<buttons>``` and ```<selects>```. However, there are a lot of keyboard shortcuts I've built in, so check them out in [```handleKeyPress()```](https://github.com/calesce/tab-editor/blob/master/src/containers/App.js#L204). I plan on adding a keyboard shortcuts modal (by hitting ```?```, like on Github or other sites) to help with this.

This uses the Web Audio API for playback. Thanks to [soundfont-player](https://github.com/danigb/soundfont-player) for making some standard MIDI soundfonts available as Web Audio Buffer nodes. Unfortunately, I can't get playback to work on Safari (haven't tested MS Edge), but it works well on Chrome/Firefox.

### Development

Running the app is fairly straightforward with Node:

```
npm install
npm start
open http://localhost:3000
```

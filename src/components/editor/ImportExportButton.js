import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import { replaceSong } from '../../actions/tracks';
import { getTracksSelector } from '../../util/selectors/track';
import { importMusicXml } from '../../util/musicXml';

const styles = StyleSheet.create({
  hidden: { display: 'none' },
  hover: {
    ':hover': {
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      cursor: 'pointer',
      fill: '#b3caf5'
    }
  }
});

class ImportButton extends Component {
  inputRef = input => {
    this._input = input;
  };

  importClicked = () => {
    this._input.click();
  };

  onImport = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = this.onFileRead;
    reader.readAsText(file);
  };

  onFileRead = e => {
    const tracks = importMusicXml(e.target.result);
    this.props.replaceSong(tracks);
  };

  render() {
    return (
      <div>
        <svg
          onClick={this.importClicked}
          width={40}
          height={50}
          className={css(styles.hover)}
        >
          <g transform="scale(1.8), translate(3, 6)">
            <path d="M7 9h2v-4h3l-4-4-4 4h3zM10 6.75v1.542l4.579 1.708-6.579 2.453-6.579-2.453 4.579-1.708v-1.542l-6 2.25v4l8 3 8-3v-4z" />
          </g>
        </svg>
        <input
          ref={this.inputRef}
          type="file"
          className={css(styles.hidden)}
          onChange={this.onImport}
        />
      </div>
    );
  }
}

export default connect(null, { replaceSong })(ImportButton);

export const ExportButton = connect(getTracksSelector)(({ tracks }) => {
  const blob = new Blob([JSON.stringify(tracks)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  return (
    <a href={url} download="song">
      <svg width={40} height={50} className={css(styles.hover)}>
        <g transform="scale(1.8), translate(3, 6)">
          <path d="M8 9l4-4h-3v-4h-2v4h-3zM11.636 7.364l-1.121 1.121 4.064 1.515-6.579 2.453-6.579-2.453 4.064-1.515-1.121-1.121-4.364 1.636v4l8 3 8-3v-4z" />
        </g>
      </svg>
    </a>
  );
});

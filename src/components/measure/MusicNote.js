import React, { PureComponent } from 'react';
import { determineFlip } from '../../util/notationMath';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  overflow: { overflow: 'visible' },
  tuplet: { fontSize: 13, fontWeight: 500, fontStyle: 'italic' },
  trill: { fontSize: 12 }
});

export default class MusicNote extends PureComponent {
  renderQuarterNote(x, y, color, flip) {
    if (flip) {
      return (
        <svg x={x} y={y} className={css(styles.overflow)}>
          <path
            fill={color}
            d="M7.33992 24.843956c-3.728633 1.998327-5.715398 5.615776-4.49326 8.33707 1.303612 2.902716 5.783177 3.721912 9.999024 1.828576 4.215838-1.893346 6.579393-5.7858 5.27578-8.688506-1.30362-2.902716-5.783176-3.721912-9.999022-1.828576-.26349.118333-.533937.218218-.782524 1.449438zM3.226327 29.96113v45.414904"
          />
          <path
            strokeWidth="1.2"
            stroke={color}
            d="M3.2263266 29.961131v45.4149026"
          />
        </svg>
      );
    }

    return (
      <svg x={x} y={y} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M11.980408 34.601027c3.667507-1.965567 5.621702-5.523714 4.419597-8.200397-1.28224-2.85513-5.68837-3.660897-9.835104-1.7986-4.146725 1.862308-6.471533 5.690953-5.18929 8.546072 1.28225 2.85513 5.68837 3.660898 9.835103 1.7986.25917-.116393.525184-.21464.769696-1.425677z"
        />
        <path
          strokeWidth="1.2"
          stroke={color}
          d="M16.026564 29.56774v-44.670396"
        />
      </svg>
    );
  }

  renderHalfNote(x, y, color, flip) {
    if (flip) {
      return (
        <svg x={x} y={y} className={css(styles.overflow)}>
          <path
            fill={color}
            d="M7.23 24.92c-3.668 1.964-5.622 5.522-4.42 8.198 1.282 2.856 5.69 3.66 9.835 1.8 4.147-1.863 6.47-5.692 5.188-8.547-1.282-2.855-5.688-3.66-9.834-1.8-.26.118-.527.217-.77.347zm1.2 2.42c.258-.135.522-.235.798-.36 3.536-1.587 6.95-1.663 7.62-.166.673 1.494-1.65 3.996-5.186 5.584-3.536 1.587-6.95 1.663-7.62.166-.62-1.378 1.31-3.64 4.386-5.225z"
          />
          <path stroke={color} strokeWidth="1.2" d="M3.34 29.332v44.67" />
        </svg>
      );
    }

    return (
      <svg x={x} y={y} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M12.22 34.28c3.668-1.964 5.622-5.522 4.42-8.198-1.282-2.856-5.69-3.66-9.835-1.8-4.147 1.863-6.47 5.692-5.188 8.547 1.282 2.855 5.688 3.66 9.834 1.8.26-.118.527-.217.77-.347zm-1.2-2.42c-.258.135-.522.235-.798.36-3.536 1.587-6.95 1.663-7.62.166-.673-1.494 1.65-3.996 5.186-5.584 3.536-1.587 6.95-1.663 7.62-.166.62 1.378-1.31 3.64-4.386 5.225z"
        />
        <path
          strokeWidth="1.2"
          stroke={color}
          d="M16.110564 29.86774v-44.670396"
        />
      </svg>
    );
  }

  renderWholeNote(x, y, color) {
    return (
      <svg x={x} y={y} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M12.768 35.447c-3.296-.174-5.872-3.1-6.906-6.127-.626-1.776-.282-4.44 1.804-4.94 3.023-.513 5.53 2.055 6.937 4.513 1.002 1.822 1.555 4.692-.322 6.137-.445.3-.984.42-1.512.417zm5.252-10.374c-3.714-2.256-8.406-2.432-12.473-1.17C2.97 24.804.024 26.72 0 29.84c-.002 3.055 2.842 4.96 5.358 5.87 3.983 1.302 8.58 1.187 12.298-.89 2.106-1.12 3.972-3.44 3.34-6.01-.35-1.653-1.615-2.89-2.976-3.737z"
        />
      </svg>
    );
  }

  renderEighthNote(x, y, color, flip) {
    if (flip) {
      return (
        <svg x={x} y={y} className={css(styles.overflow)}>
          <path
            fill={color}
            d="M16.968 24.49c3.353 3.01 1.52 7.917-4.016 10.74-1.846.942-3.208 1.35-5.643 1.278-1.478-.038-3.177-.89-3.177-.89 0 10.834.04 31.37.04 41.49-.6-.002-.984.005-1.824.005 0-.595.007-1.023.007-1.55 0-.516-.036-.85-.086-1.173-.58-3.78-1.427-5.267-5.652-9.938-5.345-5.908-6.897-9.466-6.865-14.19.03-4.434 3.93-13.93 4.815-13.535-1.233 3.322-2.895 6.905-3.337 9.904-.54 3.665.95 8.837 3.345 11.565 1.97 2.244 6.508 4.25 7.746 4.25 0 0 .053-21.822.053-30.096 0-1.426 1.29-3.842 2.018-4.71 3.317-3.96 9.68-5.754 12.578-3.15z"
          />
        </svg>
      );
    }

    return (
      <svg x={x} y={y} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M2.232 35.71C-1.12 32.7.712 27.794 6.248 24.97c1.846-.942 3.208-1.35 5.643-1.278 1.478.038 3.177.89 3.177.89 0-10.834-.04-31.37-.04-41.49.6.002.984-.005 1.824-.005 0 .595-.007 1.023-.007 1.55 0 .516.036.85.086 1.173.58 3.78 1.427 5.267 5.652 9.938 5.345 5.908 6.897 9.466 6.865 14.19-.03 4.434-3.93 13.93-4.815 13.535 1.233-3.322 2.895-6.905 3.337-9.904.54-3.665-.95-8.837-3.345-11.565-1.97-2.244-6.508-4.25-7.746-4.25 0 0-.053 21.822-.053 30.096 0 1.426-1.29 3.842-2.018 4.71-3.317 3.96-9.68 5.754-12.578 3.15z"
        />
      </svg>
    );
  }

  renderSixteenthNote(x, y, color, flip) {
    if (flip) {
      return (
        <svg x={x} y={y} className={css(styles.overflow)}>
          <g transform="rotate(180 7 30), matrix(.125 0 0 .125 -4 -12.5)">
            <ellipse
              stroke={color}
              fill={color}
              transform="rotate(-23 83.5 335.5)"
              cx="83.5"
              cy="340.5"
              rx="72.5"
              ry="46.5"
            />
            <path
              d="M149.5 6v323.05V6z"
              stroke={color}
              fill={color}
              strokeWidth="10"
            />
            <path
              d="M149.5 6v323.05V6zM213.92406 101.04561c-28.59228-38.14294-59.86623-45.92692-59.86623-45.92692V7.6224c0 .91303-4.33153 7.27183 12.56624 26.3776 2.52347 2.8532 10.00702 9.9108 51.7437 45.57988 6.67432 5.70403 51.64764 73.4412 27.23124 114.88894l-6.03174-8.987c5.255-10.278 2.94907-46.29325-25.6432-84.4362z"
              stroke={color}
              fill={color}
            />
            <path
              d="M221.992 194.508c-23.1-27.952-68.09-39.207-68.09-39.207V77.51c0-5.047-.226 25.933 9.935 34.676 29.577 25.452 38.977 36.87 58.155 52.676 53.52 44.11 20.69 123.34 17.62 146.345H228.1c2.64-8.537 22.23-82.41-6.106-116.7z"
              stroke={color}
              fill={color}
            />
          </g>
        </svg>
      );
    }

    return (
      <svg x={x} y={y} className={css(styles.overflow)}>
        <g transform="matrix(.125 0 0 .125 -4 -12.5)">
          <ellipse
            stroke={color}
            fill={color}
            transform="rotate(-23 83.5 335.5)"
            cx="83.5"
            cy="340.5"
            rx="72.5"
            ry="46.5"
          />
          <path d="M149.5 6v323.05V6z" stroke={color} strokeWidth="10" />
          <path
            d="M149.5 6v323.05V6zM213.92406 101.04561c-28.59228-38.14294-59.86623-45.92692-59.86623-45.92692V7.6224c0 .91303-4.33153 7.27183 12.56624 26.3776 2.52347 2.8532 10.00702 9.9108 51.7437 45.57988 6.67432 5.70403 51.64764 73.4412 27.23124 114.88894l-6.03174-8.987c5.255-10.278 2.94907-46.29325-25.6432-84.4362z"
            stroke={color}
            fill={color}
          />
          <path
            d="M221.992 194.508c-23.1-27.952-68.09-39.207-68.09-39.207V77.51c0-5.047-.226 25.933 9.935 34.676 29.577 25.452 38.977 36.87 58.155 52.676 53.52 44.11 20.69 123.34 17.62 146.345H228.1c2.64-8.537 22.23-82.41-6.106-116.7z"
            stroke={color}
            fill={color}
          />
        </g>
      </svg>
    );
  }

  renderThirtySecondNote(x, y, color) {
    return (
      <svg x={x - 8} y={y - 15} className={css(styles.overflow)}>
        <g transform="scale(0.4)">
          <path
            fill={color}
            d="M23.71961 87.85213c-5.58785-5.02026-2.53077-13.19751 6.69317-17.90321 3.07692-1.56973 5.34644-2.24914 9.40578-2.12895 2.46224.06314 5.29391 1.48242 5.29391 1.48242 0-18.05494-.06821-52.28016-.06821-69.15127 1.00028.00563 1.64015-.00648 3.04094-.00648 0 .99254-.01335 1.7062-.01335 2.58602 0 .85738.06034 1.41406.1432 1.95287.96866 6.29923 2.37919 8.7789 9.42205 16.56374 8.9072 9.84558 11.49436 15.77596 11.44145 23.65154-.04921 7.38807-6.54795 23.21243-8.02557 22.55589 2.05465-5.53599 4.82532-11.50844 5.56223-16.50593.90056-6.10733-1.58049-14.72667-5.57333-19.27425-3.28359-3.73981-10.84654-7.08467-12.90954-7.08467 0 0-.08757 36.37228-.08757 50.16231 0 2.37471-2.15126 6.40059-3.36307 7.84809-5.52631 6.60112-16.13366 9.58986-20.96209 5.25188z"
          />
        </g>
      </svg>
    );
  }

  renderNote(x, y, color, flip) {
    switch (this.props.note.duration) {
      case 'q':
        return this.renderQuarterNote(x + 1, y, color, flip);
      case 'h':
        return this.renderHalfNote(x + 1, y, color, flip);
      case 'w':
        return this.renderWholeNote(x + 1, y, color);
      case 'e':
        return this.renderEighthNote(x + 1, y, color, flip);
      case 's':
        return this.renderSixteenthNote(x + 1, y, color, flip);
      case 't':
        return this.renderThirtySecondNote(x + 1, y, color);
      default:
        return null;
    }
  }

  renderDot(x, y, color) {
    return (
      <svg x={x} y={y} width={20} height={20} className={css(styles.overflow)}>
        <circle cx={26} cy={33} r={1.5} fill={color} stroke={color} />
      </svg>
    );
  }

  renderTremolo(x, y, color) {
    return (
      <svg x={x} y={y} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M17.025 0L4.538 6.412V3.375l12.487-6.412m0 8.55L4.538 11.925V8.887l12.487-6.412m0 8.55L4.538 17.437V14.4l12.487-6.413"
        />
      </svg>
    );
  }

  renderVibrato(x, y, color) {
    return (
      <svg x={x + 5} y={y - 3}>
        <path
          fill={color}
          d="M14.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168L8.832 2.976 6.336 5.784c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168L2.144 2.976c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36C3.2.072 3.392 0 3.616 0c.192 0 .352.048.48.168l3.136 2.856L9.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z"
        />
        <path
          fill={color}
          d="M27.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.136-2.856-2.496 2.808c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.168-2.856c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.136 2.856L22.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z"
        />
      </svg>
    );
  }

  renderTrill(x, color) {
    return (
      <svg x={x + 1.5} y={10}>
        <text y={7} className={css(styles.trill)}>
          tr
        </text>
        <path
          fill={color}
          d="M25.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.136-2.856-2.496 2.808c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.168-2.856c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.136 2.856L20.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z"
        />
      </svg>
    );
  }

  renderTuplet(x, y, flip, color) {
    const yToUse = flip ? y + 17 : y + 49;
    const xToUse = flip ? x + 9 : x + 5;
    return (
      <svg x={xToUse} y={yToUse} className={css(styles.overflow)}>
        <text color={color} y={0} className={css(styles.tuplet)}>
          3
        </text>
      </svg>
    );
  }

  renderSharp(x, y, color) {
    return (
      <svg x={x} y={y + 0.5} className={css(styles.overflow)}>
        <g transform="scale(1.3)">
          <path
            fill={color}
            d="M-4.094 25.154V20.45l2-.552v4.68l-2 .576zm3.938-1.138l-1.375.394v-4.68l1.374-.384v-1.944l-1.375.384v-4.782h-.564v4.927l-2 .576v-4.65h-.53v4.827L-6 19.068v1.948l1.375-.384v4.67L-6 25.687v1.94l1.375-.384v4.755h.53v-4.925l2-.55v4.626h.564v-4.8l1.374-.385v-1.947z"
          />
        </g>
      </svg>
    );
  }

  renderNatural(x, y, color) {
    return (
      <svg x={x} y={y + 7} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M-.78706 34.76956l-.9055.32338v-7.4067L-6.9 29.9506V10.738l.8733-.388v7.53618l5.2394-2.3936v19.2763zm-.9055-10.35v-5.175L-6.026 21.1531v5.175l4.33366-1.909z"
        />
      </svg>
    );
  }

  renderFlat(x, y, color) {
    return (
      <svg x={x} y={y + 7} className={css(styles.overflow)}>
        <path
          fill={color}
          d="M-2.315 22.59c0 .747-.28 1.463-1.05 2.424-.814 1.018-1.5 1.6-2.403 2.286v-4.462c.205-.518.508-.938.91-1.26.4-.322.806-.483 1.217-.483.677 0 1.108.385 1.293 1.152.02.062.032.177.032.343zm-.098-3.12c-.56 0-1.13.155-1.71.465-.58.31-1.128.724-1.645 1.24v-9.453H-6.5v16.192c0 .457.125.686.374.686.145 0 .324-.12.592-.28.758-.453 1.23-.756 1.744-1.075.586-.364 1.246-.79 2.118-1.62.602-.605 1.038-1.215 1.308-1.83.27-.614.404-1.222.404-1.826 0-.896-.238-1.532-.713-1.907-.54-.395-1.12-.593-1.74-.593z"
        />
      </svg>
    );
  }

  renderLedgerLines(x, direction, numLines, y) {
    if (direction === 'above') {
      return Array.from({ length: numLines }).map((_, i) => (
        <rect
          key={i}
          x={x - 2}
          y={y - 13 * (i + 2)}
          width={20}
          height={0.5}
          fill="#999999"
          strokeWidth={0.1}
        />
      ));
    } else {
      return Array.from({ length: numLines }).map((_, i) => (
        <rect
          key={i}
          x={x - 2}
          y={y + 13 * i}
          width={20}
          height={0.5}
          fill="#999999"
          strokeWidth={0.1}
        />
      ));
    }
  }

  render() {
    const { note, yTop, chordIndex, color } = this.props;
    const { x, dotted, tremolo, vibrato, trill, tuplet } = note;

    const y = note.notes[chordIndex].y;
    const flip = determineFlip(note, y, yTop);

    const topNoteY = yTop - 11;
    const bottomNoteY = topNoteY + 11.7 * 5 + 13;
    const topStaffY = yTop + 38;
    const bottomStaffY = yTop + 38 + 10.4 * 5;

    let ledgerLinesAbove, ledgerLinesBelow;
    if (y >= bottomNoteY) {
      ledgerLinesBelow = Math.round((y - bottomNoteY) / 13) + 1;
    } else if (y <= topNoteY) {
      ledgerLinesAbove = Math.round((topNoteY - y) / 13 + 1) - 1;
    }

    return (
      <g>
        {ledgerLinesBelow &&
          this.renderLedgerLines(x, 'below', ledgerLinesBelow, bottomStaffY)}
        {ledgerLinesAbove &&
          this.renderLedgerLines(x, 'above', ledgerLinesAbove, topStaffY)}
        {this.renderNote(x, y, color, flip)}
        {note.notes[chordIndex].renderSharp && this.renderSharp(x, y, color)}
        {note.notes[chordIndex].renderNatural &&
          this.renderNatural(x, y, color)}
        {dotted && this.renderDot(x, y, color)}
        {tremolo && this.renderTremolo(x, y, color)}
        {vibrato && this.renderVibrato(x, y, color)}
        {trill && this.renderTrill(x, color)}
        {tuplet && this.renderTuplet(x, y, flip, color, tuplet)}
      </g>
    );
  }
}

import React, { Component } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class MusicNote extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor() {
    super();

    this.renderQuarterNote = this.renderQuarterNote.bind(this);
    this.renderHalfNote = this.renderHalfNote.bind(this);
    this.renderWholeNote = this.renderWholeNote.bind(this);
    this.renderEighthNote = this.renderEighthNote.bind(this);
    this.renderSixteenthNote = this.renderSixteenthNote.bind(this);
    this.renderThirtySecondNote = this.renderThirtySecondNote.bind(this);
    this.renderNote = this.renderNote.bind(this);
    this.renderDot = this.renderDot.bind(this);
    this.renderTremolo = this.renderTremolo.bind(this);
    this.renderVibrato = this.renderVibrato.bind(this);
    this.renderTrill = this.renderTrill.bind(this);
    this.renderSharp = this.renderSharp.bind(this);
    this.renderNatural = this.renderNatural.bind(this);
    this.renderFlat = this.renderFlat.bind(this);
    this.renderLedgerLines = this.renderLedgerLines.bind(this);
  }

  renderQuarterNote(x, y, color) {
    if(this.props.flip) {
      return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}>
          <g>
            <path fill={color} d='M7.33992 24.843956c-3.728633 1.998327-5.715398 5.615776-4.49326 8.33707 1.303612 2.902716 5.783177 3.721912 9.999024 1.828576 4.215838-1.893346 6.579393-5.7858 5.27578-8.688506-1.30362-2.902716-5.783176-3.721912-9.999022-1.828576-.26349.118333-.533937.218218-.782524 1.449438zM3.226327 29.96113v45.414904'/>
            <path strokeWidth='1.2' stroke={color} d='M3.2263266 29.961131v45.4149026' />
          </g>
        </svg>
      );
    }

    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <g>
          <path fill={color} d='M11.980408 34.601027c3.667507-1.965567 5.621702-5.523714 4.419597-8.200397-1.28224-2.85513-5.68837-3.660897-9.835104-1.7986-4.146725 1.862308-6.471533 5.690953-5.18929 8.546072 1.28225 2.85513 5.68837 3.660898 9.835103 1.7986.25917-.116393.525184-.21464.769696-1.425677z'/>
          <path strokeWidth='1.2' stroke={color} d='M16.026564 29.56774v-44.670396' />
        </g>
      </svg>
    );
  }

  renderHalfNote(x, y, color) {
    if(this.props.flip) {
      return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}>
          <g transform='rotate(180 8 23)'>
            <path fill={color} d='M10.1835 27.7344c3.0564-1.638 4.6845-4.6026 3.6828-6.8328-1.0683-2.3796-4.7403-3.051-8.1954-1.4994-3.456 1.5516-5.391 4.743-4.3236 7.1217 1.0683 2.3805 4.7403 3.051 8.1954 1.5003.216-.0972.4383-.18.6417-.288zm-.999-2.0178c-.216.1125-.4365.1962-.666.2997-2.9466 1.323-5.7915 1.386-6.3513.1386-.5598-1.2447 1.377-3.33 4.3227-4.653 2.9466-1.323 5.7915-1.386 6.3513-.1386.5157 1.1484-1.0935 3.033-3.6558 4.3542z'/>
            <path stroke={color} strokeWidth='1.2' d='M 13.42547,24.05645 L 13.42547,-13.16888' />
          </g>
        </svg>
      );
    }

    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <path fill={color} d='M10.1835 27.7344c3.0564-1.638 4.6845-4.6026 3.6828-6.8328-1.0683-2.3796-4.7403-3.051-8.1954-1.4994-3.456 1.5516-5.391 4.743-4.3236 7.1217 1.0683 2.3805 4.7403 3.051 8.1954 1.5003.216-.0972.4383-.18.6417-.288zm-.999-2.0178c-.216.1125-.4365.1962-.666.2997-2.9466 1.323-5.7915 1.386-6.3513.1386-.5598-1.2447 1.377-3.33 4.3227-4.653 2.9466-1.323 5.7915-1.386 6.3513-.1386.5157 1.1484-1.0935 3.033-3.6558 4.3542z'/>
        <path stroke={color} strokeWidth='1.2' d='M 13.42547,24.05645 L 13.42547,-13.16888' />
      </svg>
    );
  }

  renderWholeNote(x, y, color) {
    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <path fill={color} d='M10.640336 27.872464c-2.7472-.14536-4.893984-2.583936-5.755408-5.105648-.521904-1.480064-.235248-3.700416 1.503456-4.11616 2.519056-.42784 4.609376 1.712016 5.780912 3.759792.83456 1.518832 1.295952 3.91064-.268832 5.114592-.371536.249168-.820672.349104-1.260128.347424zm4.3764-8.645264c-3.09512-1.87984-7.00488-2.026272-10.394128-.97424C2.47568 19.0036.020304 20.600368 0 23.1992c-.001488 2.546336 2.368 4.1348 4.464784 4.891344 3.319504 1.08584 7.149552.990352 10.248832-.74064 1.754368-.933376 3.309328-2.866144 2.782048-5.008416-.289936-1.377552-1.3452-2.40832-2.478928-3.114288z'/>
      </svg>
    );
  }

  renderEighthNote(x, y, color) {
    if(this.props.flip) {
      return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}>
          <g transform='rotate(180 8 23)'>
            <path fill={color} d='M1.8598 28.92607c-2.79392-2.51014-1.26538-6.59876 3.3466-8.9516C6.74485 19.1896 7.8796 18.8499 9.90928 18.91c1.23112.03155 2.64696.7412 2.64696.7412 0-9.0275-.0341-26.1401-.0341-34.57565.50013.00282.82007-.00324 1.52046-.00324 0 .49628-.00668.8531-.00668 1.293 0 .4287.03017.70705.0716.97646.48433 3.1496 1.1896 4.38945 4.71103 8.28187 4.4536 4.9228 5.74718 7.88798 5.72072 11.82577-.0246 3.69404-3.27397 11.60622-4.01278 11.27795 1.0273-2.768 2.41264-5.75422 2.7811-8.25296.45027-3.0537-.79025-7.36336-2.78667-9.63715-1.6418-1.8699-5.42327-3.54233-6.45477-3.54233 0 0-.0438 18.18614-.0438 25.08115 0 1.18736-1.07562 3.2003-1.68152 3.92405C9.57768 29.60068 4.274 31.09505 1.8598 28.92606z'/>
          </g>
        </svg>
      );
    }

    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <path fill={color} d='M1.8598 28.92607c-2.79392-2.51014-1.26538-6.59876 3.3466-8.9516C6.74485 19.1896 7.8796 18.8499 9.90928 18.91c1.23112.03155 2.64696.7412 2.64696.7412 0-9.0275-.0341-26.1401-.0341-34.57565.50013.00282.82007-.00324 1.52046-.00324 0 .49628-.00668.8531-.00668 1.293 0 .4287.03017.70705.0716.97646.48433 3.1496 1.1896 4.38945 4.71103 8.28187 4.4536 4.9228 5.74718 7.88798 5.72072 11.82577-.0246 3.69404-3.27397 11.60622-4.01278 11.27795 1.0273-2.768 2.41264-5.75422 2.7811-8.25296.45027-3.0537-.79025-7.36336-2.78667-9.63715-1.6418-1.8699-5.42327-3.54233-6.45477-3.54233 0 0-.0438 18.18614-.0438 25.08115 0 1.18736-1.07562 3.2003-1.68152 3.92405C9.57768 29.60068 4.274 31.09505 1.8598 28.92606z'/>
      </svg>
    );
  }

  renderSixteenthNote(x, y, color) {
    if(this.props.flip) {
      return (
        <svg x={x} y={y} style={{ overflow: 'visible' }}>
          <g transform='rotate(180 7 30), matrix(.125 0 0 .125 -4 -12.5)'>
            <ellipse stroke={color} transform="rotate(-23 83.5 335.5)" cx="83.5" cy="340.5" rx="72.5" ry="46.5" />
            <path d="M149.5 6v323.05V6z" stroke={color} strokeWidth="10"/>
            <path d="M149.5 6v323.05V6zM213.92406 101.04561c-28.59228-38.14294-59.86623-45.92692-59.86623-45.92692V7.6224c0 .91303-4.33153 7.27183 12.56624 26.3776 2.52347 2.8532 10.00702 9.9108 51.7437 45.57988 6.67432 5.70403 51.64764 73.4412 27.23124 114.88894l-6.03174-8.987c5.255-10.278 2.94907-46.29325-25.6432-84.4362z" stroke={color} fill={color}></path>
            <path d="M221.992 194.508c-23.1-27.952-68.09-39.207-68.09-39.207V77.51c0-5.047-.226 25.933 9.935 34.676 29.577 25.452 38.977 36.87 58.155 52.676 53.52 44.11 20.69 123.34 17.62 146.345H228.1c2.64-8.537 22.23-82.41-6.106-116.7z" stroke={color} fill={color}></path>
          </g>
        </svg>
      );
    }

    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <g transform='matrix(.125 0 0 .125 -4 -12.5)'>
          <ellipse stroke={color} transform="rotate(-23 83.5 335.5)" cx="83.5" cy="340.5" rx="72.5" ry="46.5" />
          <path d="M149.5 6v323.05V6z" stroke={color} strokeWidth="10"/>
          <path d="M149.5 6v323.05V6zM213.92406 101.04561c-28.59228-38.14294-59.86623-45.92692-59.86623-45.92692V7.6224c0 .91303-4.33153 7.27183 12.56624 26.3776 2.52347 2.8532 10.00702 9.9108 51.7437 45.57988 6.67432 5.70403 51.64764 73.4412 27.23124 114.88894l-6.03174-8.987c5.255-10.278 2.94907-46.29325-25.6432-84.4362z" stroke={color} fill={color}></path>
          <path d="M221.992 194.508c-23.1-27.952-68.09-39.207-68.09-39.207V77.51c0-5.047-.226 25.933 9.935 34.676 29.577 25.452 38.977 36.87 58.155 52.676 53.52 44.11 20.69 123.34 17.62 146.345H228.1c2.64-8.537 22.23-82.41-6.106-116.7z" stroke={color} fill={color}></path>
        </g>
      </svg>
    );
  }

  renderThirtySecondNote(x, y, color) {
    return (
      <svg x={x - 8} y={y - 15} style={{ overflow: 'visible' }}>
        <g transform='scale(0.4)'>
          <path fill={color} d='M23.71961 87.85213c-5.58785-5.02026-2.53077-13.19751 6.69317-17.90321 3.07692-1.56973 5.34644-2.24914 9.40578-2.12895 2.46224.06314 5.29391 1.48242 5.29391 1.48242 0-18.05494-.06821-52.28016-.06821-69.15127 1.00028.00563 1.64015-.00648 3.04094-.00648 0 .99254-.01335 1.7062-.01335 2.58602 0 .85738.06034 1.41406.1432 1.95287.96866 6.29923 2.37919 8.7789 9.42205 16.56374 8.9072 9.84558 11.49436 15.77596 11.44145 23.65154-.04921 7.38807-6.54795 23.21243-8.02557 22.55589 2.05465-5.53599 4.82532-11.50844 5.56223-16.50593.90056-6.10733-1.58049-14.72667-5.57333-19.27425-3.28359-3.73981-10.84654-7.08467-12.90954-7.08467 0 0-.08757 36.37228-.08757 50.16231 0 2.37471-2.15126 6.40059-3.36307 7.84809-5.52631 6.60112-16.13366 9.58986-20.96209 5.25188z'/>
        </g>
      </svg>
    );
  }

  renderNote(x, y, color) {
    switch(this.props.duration) {
      case 'q':
        return this.renderQuarterNote(x + 1, y, color);
      case 'h':
        return this.renderHalfNote(x + 1, y, color);
      case 'w':
        return this.renderWholeNote(x + 1, y, color);
      case 'e':
        return this.renderEighthNote(x + 1, y, color);
      case 's':
        return this.renderSixteenthNote(x + 1, y, color);
      case 't':
        return this.renderThirtySecondNote(x + 1, y, color);
      default:
        return null;
    }
  }

  renderDot(x, y, color) {
    return (
      <svg x={x} y={y} width={20} height={20} style={{ overflow: 'visible' }}>
        <circle cx={22} cy={26} r={1.5} fill={color} stroke={color} />
      </svg>
    );
  }

  renderTremolo(x, y, color) {
    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <g>
          <path fill={color} d='M20.025 0L7.5375 6.4125V3.375L20.025-3.0375M20.025 5.5125L7.5375 11.925V8.8875L20.025 2.475M20.025 11.025L7.5375 17.4375V14.4L20.025 7.9875'/>
        </g>
      </svg>
    );
  }

  renderVibrato(x, y, color) {
    return (
      <svg x={x + 5} y={y - 3}>
        <g>
          <path fill={color} d='M14.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168L8.832 2.976 6.336 5.784c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168L2.144 2.976c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36C3.2.072 3.392 0 3.616 0c.192 0 .352.048.48.168l3.136 2.856L9.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z'/><path d='M27.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.136-2.856-2.496 2.808c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.168-2.856c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.136 2.856L22.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z'/>
        </g>
      </svg>
    );
  }

  renderTrill(x, color) {
    return (
      <svg x={x + 1.5} y={10}>
        <text y={7} style={{ fontSize: 12 }}>tr</text>
        <g>
          <path fill={color} d='M25.912 1.896c.128-.144.288-.216.512-.216.352 0 .64.216.64.48 0 .096-.032.192-.096.264-.992 1.128-1.984 2.232-2.976 3.36-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.136-2.856-2.496 2.808c-.128.144-.32.216-.544.216-.192 0-.352-.048-.48-.168l-3.168-2.856c-.32.384-.672.744-.992 1.128-.128.144-.288.216-.512.216-.352 0-.64-.216-.64-.48 0-.096.032-.192.096-.264.992-1.128 1.984-2.232 2.976-3.36.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.136 2.856L20.728.216c.128-.144.32-.216.544-.216.192 0 .352.048.48.168l3.168 2.856c.32-.384.672-.744.992-1.128z'/>
        </g>
      </svg>
    );
  }

  renderTuplet(x, y, flip, color) {
    const yToUse = flip ? y + 15 : y + 51;
    const xToUse = flip ? x + 9 : x + 6;
    return (
      <svg x={xToUse} y={yToUse} style={{ overflow: 'visible' }}>
        <text color={color} y={0} style={{ fontSize: 13, fontWeight: 500, fontStyle: 'italic' }}>3</text>
      </svg>
    );
  }

  renderSharp(x, y, color) {
    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <path fill={color} d='M-4.094 25.154V20.45l2-.552v4.68l-2 .576zm3.938-1.138l-1.375.394v-4.68l1.374-.384v-1.944l-1.375.384v-4.782h-.564v4.927l-2 .576v-4.65h-.53v4.827L-6 19.068v1.948l1.375-.384v4.67L-6 25.687v1.94l1.375-.384v4.755h.53v-4.925l2-.55v4.626h.564v-4.8l1.374-.385v-1.947z'/>
      </svg>
    );
  }

  renderNatural(x, y, color) {
    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <path fill={color} d='M-.78706 34.76956l-.9055.32338v-7.4067L-6.9 29.9506V10.738l.8733-.388v7.53618l5.2394-2.3936v19.2763zm-.9055-10.35v-5.175L-6.026 21.1531v5.175l4.33366-1.909z'/>
      </svg>
    );
  }

  renderFlat(x, y, color) {
    return (
      <svg x={x} y={y} style={{ overflow: 'visible' }}>
        <path fill={color} d='M-2.315 22.59c0 .747-.28 1.463-1.05 2.424-.814 1.018-1.5 1.6-2.403 2.286v-4.462c.205-.518.508-.938.91-1.26.4-.322.806-.483 1.217-.483.677 0 1.108.385 1.293 1.152.02.062.032.177.032.343zm-.098-3.12c-.56 0-1.13.155-1.71.465-.58.31-1.128.724-1.645 1.24v-9.453H-6.5v16.192c0 .457.125.686.374.686.145 0 .324-.12.592-.28.758-.453 1.23-.756 1.744-1.075.586-.364 1.246-.79 2.118-1.62.602-.605 1.038-1.215 1.308-1.83.27-.614.404-1.222.404-1.826 0-.896-.238-1.532-.713-1.907-.54-.395-1.12-.593-1.74-.593z'/>
      </svg>
    );
  }

  renderLedgerLines(x, direction, numLines) {
    if(direction === 'above') {
      return Array.from({ length: numLines}).map((_, i) =>
        <rect key={i} x={x - 2} y={90 - 13 * (i + 1)} width={20} height={0.5} fill='#999999'
          strokeWidth={0.1}></rect>
      );
    } else {
      return Array.from({ length: numLines}).map((_, i) =>
        <rect key={i} x={x - 2} y={90 + 4 * 13 + 13 * (i + 1)} width={20} height={0.5} fill='#999999'
          strokeWidth={0.1}></rect>
      );
    }
  }

  render() {
    const { x, y, color, sharp, natural, dotted, tremolo, vibrato, trill, tuplet, flip } = this.props;

    let ledgerLinesAbove, ledgerLinesBelow;
    if(y >= 125.5) {
      ledgerLinesBelow = Math.round((y - 125.5) / 13 + 1) - 1;
    } else if(y <= 60.5) {
      ledgerLinesAbove = Math.round((60.5 - y) / 13 + 1) - 1;
    }

    return (
      <g>
        { ledgerLinesBelow ? this.renderLedgerLines(x, 'below', ledgerLinesBelow) : null }
        { ledgerLinesAbove ? this.renderLedgerLines(x, 'above', ledgerLinesAbove) : null }
        { this.renderNote(x, y, color) }
        { sharp ? this.renderSharp(x, y, color) : null }
        { natural ? this.renderNatural(x, y, color) : null }
        { dotted ? this.renderDot(x, y, color) : null }
        { tremolo ? this.renderTremolo(x, y, color) : null }
        { vibrato ? this.renderVibrato(x, y, color) : null }
        { trill ? this.renderTrill(x, color) : null }
        { tuplet ? this.renderTuplet(x, y, flip, color, tuplet) : null }
      </g>
    );
  }
}

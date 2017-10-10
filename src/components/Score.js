import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';

import { makeMapStateToProps } from '../util/selectors';
import { makeScoreSelector } from '../util/selectors/layout';
import { getScoreSectionWidth, calcScoreHeight } from '../util/scoreLayout';
import { setSelectRange } from '../actions/cursor';

import Measure from './measure/Measure';
import SelectBox from './SelectBox';

const SVG_LEFT = 270;
const SVG_TOP = 5;
const SELECT_ERROR = 6;

// Give some room for user error when selecting a range of notes
const styles = StyleSheet.create({
  scoreContainer: {
    overflow: 'scroll',
    height: '100vh',
    'margin-left': 15
  },
  score: {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    'margin-top': 5
  }
});

class Score extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dragStart: undefined,
      dragEnd: undefined,
      sectionWidth: getScoreSectionWidth()
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      sectionWidth: getScoreSectionWidth()
    });
  };

  getNoteRangeForMeasure(measure, xStart, xEnd) {
    const notes = measure.notes.map((note, i) => {
      const noteX = note.x + measure.xOfMeasure;
      return noteX + SELECT_ERROR > xStart && noteX + SELECT_ERROR < xEnd
        ? i
        : null;
    });
    const filteredNotes = notes.filter(note => note !== null);
    return filteredNotes.length === notes.length ? 'all' : filteredNotes;
  }

  getSelectedRangeForSingleRow(measure, xStart, xEnd) {
    if (
      xStart > measure.xOfMeasure &&
      xEnd < measure.xOfMeasure + measure.width
    ) {
      return this.getNoteRangeForMeasure(measure, xStart, xEnd);
    } else if (
      (xStart < measure.xOfMeasure && xEnd > measure.xOfMeasure) ||
      (xStart > measure.xOfMeasure &&
        xStart < measure.xOfMeasure + measure.width)
    ) {
      if (measure.xOfMeasure < xStart) {
        return this.getNoteRangeForMeasure(
          measure,
          xStart,
          measure.xOfMeasure + measure.width
        );
      } else if (xEnd < measure.xOfMeasure + measure.width) {
        return this.getNoteRangeForMeasure(measure, measure.xOfMeasure, xEnd);
      } else {
        return 'all';
      }
    } else {
      return undefined;
    }
  }

  getSelectedRange(measure, xStart, xEnd, selectedRows) {
    if (!selectedRows) {
      return undefined;
    }
    const selectedRowIndex = selectedRows.indexOf(measure.rowIndex);
    if (selectedRowIndex === -1) {
      return undefined;
    }

    if (selectedRows.length === 1) {
      return this.getSelectedRangeForSingleRow(measure, xStart, xEnd);
    } else if (selectedRowIndex === 0) {
      if (measure.xOfMeasure + measure.width > xStart) {
        if (measure.xOfMeasure < xStart) {
          // starting measure, need note index
          return this.getNoteRangeForMeasure(
            measure,
            xStart,
            measure.xOfMeasure + measure.width
          );
        } else {
          return 'all';
        }
      }
    } else if (selectedRowIndex === selectedRows.length - 1) {
      if (xEnd > measure.xOfMeasure) {
        if (xEnd < measure.xOfMeasure + measure.width) {
          // last measure
          return this.getNoteRangeForMeasure(measure, measure.xOfMeasure, xEnd);
        } else {
          return 'all';
        }
      }
    } else {
      return 'all';
    }
  }

  rowFromY(dragY, measures, tuning) {
    const rowHeights = measures.reduce((accum, measure) => {
      if (!accum[measure.rowIndex]) {
        return accum.concat(
          (accum.length > 0 ? accum[accum.length - 1] : 0) +
            measure.yTop +
            measure.yBottom +
            75 +
            tuning.length * 20
        );
      }
      return accum;
    }, []);

    return rowHeights
      ? rowHeights.reduce(
          (accum, row, i) => (accum === -1 && dragY < row ? i : accum),
          -1
        )
      : 0;
  }

  onMouseDown = e => {
    e.preventDefault();

    const dragX = e.pageX - SVG_LEFT;
    const dragY = e.pageY - SVG_TOP;

    this.setState({ dragStart: { dragX, dragY }, dragX, dragY });
  };

  onMouseUp = () => {
    const { dragX, dragY, dragHeight, dragWidth } = this.state;

    let selectedRows;
    if (dragWidth > 5 && dragHeight > 5) {
      const startRow = this.rowFromY(
        dragY,
        this.props.measures,
        this.props.tuning
      );
      const endRow = this.rowFromY(
        dragY + dragHeight,
        this.props.measures,
        this.props.tuning
      );
      selectedRows = Array.from(
        { length: endRow - startRow + 1 },
        (_, k) => k + startRow
      );
    }

    const selectRange = this.props.measures.reduce((accum, measure, i) => {
      const measureRange = this.getSelectedRange(
        measure,
        dragX,
        dragX + dragWidth,
        selectedRows
      );
      if (Array.isArray(measureRange)) {
        if (measureRange.length === 0) {
          return accum;
        }
      }

      const obj = {};
      obj[i] = measureRange;
      return measureRange ? Object.assign({}, accum, obj) : accum;
    }, {});

    if (Object.keys(selectRange).length > 0) {
      this.props.setSelectRange(selectRange);
    } else {
      this.props.setSelectRange(undefined);
    }

    this.setState({
      dragStart: undefined,
      dragX: undefined,
      dragY: undefined,
      dragWidth: undefined,
      dragHeight: undefined
    });
  };

  onMouseMove = e => {
    if (this.state.dragStart) {
      e.preventDefault();

      const x = e.pageX - SVG_LEFT;
      const y = e.pageY - SVG_TOP;

      this.setState({
        dragX: Math.min(this.state.dragStart.dragX, x),
        dragY: Math.min(this.state.dragStart.dragY, y),
        dragWidth: Math.abs(this.state.dragStart.dragX - x),
        dragHeight: Math.abs(this.state.dragStart.dragY - y)
      });
    }
  };

  calcLinearWidth(measures) {
    return measures.reduce((width, measure) => {
      return measure.width + width;
    }, 20);
  }

  render() {
    const { measures, layout, tuning } = this.props;
    const { dragX, dragY, dragWidth, dragHeight, sectionWidth } = this.state;
    const width =
      layout === 'linear' ? this.calcLinearWidth(measures) : sectionWidth;
    const height =
      layout === 'linear' ? 'auto' : calcScoreHeight(measures, tuning);

    return (
      <div className={css(styles.scoreContainer)} ref={this.props.scrollRef}>
        <div
          className={css(styles.score)}
          style={{ height, width }}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          ref={el => {
            this.scoreRef = el;
          }}
        >
          {measures.map((_, i) => <Measure key={i} measureIndex={i} />)}
          <SelectBox
            height={height}
            width={width}
            x={dragX}
            y={dragY}
            dragWidth={dragWidth}
            dragHeight={dragHeight}
          />
        </div>
      </div>
    );
  }
}

export default connect(makeMapStateToProps(makeScoreSelector), {
  setSelectRange
})(Score);

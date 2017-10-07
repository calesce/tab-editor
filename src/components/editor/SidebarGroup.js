import React, { PureComponent } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
  group: { width: '100%' },
  header: {
    paddingLeft: '8px',
    color: '#1c2f2f',
    // darkslategrey slightly darkened
    fontFamily: 'Optima, Segoe, Segoe UI, Candara, Calibri, Arial, sans-serif',
    fontSize: '0.9em',
    textTransform: 'uppercase',
    textShadow: '0.5px 0 0 rgba(0, 0, 0, 0.4)'
  },
  flex: {
    marginLeft: 5,
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
});

class SidebarGroup extends PureComponent {
  render() {
    return (
      <div className={css(styles.group)}>
        <h3 className={css(styles.header)}>{this.props.title}</h3>
        <div className={css(styles.flex)}>{this.props.children}</div>
      </div>
    );
  }
}

export default SidebarGroup;

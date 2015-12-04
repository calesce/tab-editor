import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import song from './song';

ReactDOM.render(<App song={song} />, document.getElementById('root'));

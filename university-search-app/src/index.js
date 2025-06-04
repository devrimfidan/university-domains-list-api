import React from 'react';
import ReactDOM from 'react-dom';
import App, { initApp } from './components/App';
import './styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
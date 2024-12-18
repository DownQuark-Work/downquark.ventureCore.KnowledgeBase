import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Index } from './routes/index';
import { Exchange } from './routes/exchange';
import { Farm } from './routes/farm';
import { Fund } from './routes/fund';
import { Investor } from './routes/investor';
import 'antd/dist/antd.css';
import './index.css';

function App() {
  return (
    <Router>
      <div
        style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}
      >
        <Route path="/" exact component={Index} />
        <Route path="/exchange/" component={Exchange} />
        <Route path="/farm/" component={Farm} />
        <Route path="/fund/" component={Fund} />
        <Route path="/investor/" component={Investor} />
      </div>
    </Router>
  );
}

function init() {
  const mountTarget = document.getElementById('app');

  ReactDOM.render(<App />, mountTarget);
}

window.addEventListener('load', init);

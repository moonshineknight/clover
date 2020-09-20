import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';


import './index.css';
import Index from './components/Index';
import Menu from './components/Menu';
import Detail from './components/Detail';
import Recording from './components/Recording';
import EditPage from './components/EditPage';

export default class Hello extends Component {
  render(){
    return (
      <Router>
        <Route exact path="/" component={Index} />
        <Route exact path="/menu" component={Menu} />
        <Route exact path="/detail" component={Detail} />
        <Route exact path="/recording" component={Recording} />
        <Route exact path="/editPage" component={EditPage} />
      </Router>
    )
  }
}

ReactDOM.render(
  // <React.StrictMode>
    <Hello />,
  // </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

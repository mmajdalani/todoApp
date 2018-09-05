import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import connection from './connection' //Used to log connections in console

const Root = () => {
    return(
        <Router>
            <Switch>
                <Route exact path="/" component={App}/>
            </Switch>
        </Router>
    )


};

ReactDOM.render(<Root />, document.getElementById('main'));

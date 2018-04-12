import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import App from './components/app';

import HomeIndex from './components/index_home';
import NewGame from './components/newgame';
import GameContainer from './components/gamecontainer';

export default (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomeIndex} />
            <Route path="/play" component={NewGame} />
            <Route path="/game/:gameroom/:player/:team" components={GameContainer} />
        </Route>
    </Router>

);

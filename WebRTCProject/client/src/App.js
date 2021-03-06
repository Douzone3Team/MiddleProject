
import React from "react";
import { BrowserRouter, Route } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute.js';
import Index from "views/Index";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Room from "views/Room.js";
import Profile from "views/examples/Profile.js";
import Friend from "views/examples/Friend.js";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";




function App(props) {

  return (
    <BrowserRouter>
      <Route exact path="/" component={Index} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/room/:roomId" component={Room} />
      <PrivateRoute exact path="/profile" component={Profile} />
      <PrivateRoute exact path="/friend" component={Friend} />
    </BrowserRouter>
  )
}

export default App;

import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute.js';
import Index from "views/Index";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Room from "views/Room.js";
import Profile from "views/examples/Profile.js";
import Friend from "views/examples/Friend.js";
import Cookies from "universal-cookie";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";




function App(props) {
    /* const loginCheck = async (e) => {
        if (!cookie.get("user")) {
          //쿠키가 없을때 로그인 페이지로 강제로 이동시킴
          alert("로그인을 해주세요");
          props.history.push("/login");
        } else {
          //쿠키가 있으면 쿠키 정보 검증
          const url = "/api/loginCheck";
          const boolean = true;
          await axios
            .post(url)
            .then((response) => {
              //서버에 암호화된 쿠키 정보 전달
              console.log(response.data); //서버의 검증에서 받아온 true false;
              if (!response.data) {
                //false 라면 잘못된 쿠키이므로 다시 로그인시킴
                cookie.remove("user");
                alert("다시 로그인 해주세요.");
                props.history.push("/login");
              }
              else{
                console.log(e);
                props.history.push(e);
              }
            })
            .catch((ex) => {
              console.log(ex);
            });
        }
      }; */
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
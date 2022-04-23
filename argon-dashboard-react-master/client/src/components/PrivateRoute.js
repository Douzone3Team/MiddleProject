import { Redirect, Route } from 'react-router-dom';
import IsLogin from './IsLogin.js';
import Cookie from 'universal-cookie';

import axios from 'axios';
const cookie = new Cookie();
const loginCheck = async () => {
  if (!cookie.get("user")) {
    //쿠키가 없을때 로그인 페이지로 강제로 이동시킴
    alert("로그인을 해주세요");
    return false;  
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
          return false;
        }          
      })
      .catch((ex) => {
        console.log(ex);
        return false;
      });
      return true;
  }
};
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      // Show the component only when the user is logged in
      // Otherwise, redirect the user to /login page
      <Route
        {...rest}
        
        render={(props) => ( IsLogin() ? loginCheck() ? <Component {...props} /> : <Redirect to="/login" /> : <Redirect to="/login" />)}
      />
    );
  };
  
  export default PrivateRoute;
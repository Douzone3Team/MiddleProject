import Cookie from "universal-cookie";
const cookie = new Cookie();

  
const IsLogin = () => !!cookie.get('user') ;
;

export default IsLogin;
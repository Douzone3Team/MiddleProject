import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "serviceWorker";
import App from "./App"

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // <BrowserRouter>
  //   <Switch>
  //     <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
  //     <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
  //     <Redirect from="/" to="/admin/index" />
  //   </Switch>
  // </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.register();

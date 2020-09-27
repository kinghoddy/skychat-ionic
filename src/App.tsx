import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/home/home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/index.css";

import "./main";
import Login from "./pages/auth/login";
import Profile from "./components/layout/profile";
import Signup from "./pages/auth/signup";

class App extends React.Component<any> {
  state = {
    loading: true,
    shouldRedirect: false,
  };
  componentDidMount() {
    let hasUsed = localStorage.getItem("hasUsedSkychat");
    console.log(hasUsed, "has used");
    if (hasUsed) {
      this.setState({ shouldRedirect: true, loading: false });
    } else {
      this.setState({ shouldRedirect: false, loading: false });
    }
  }
  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/feed" component={Profile} />
            <Route path="/home" component={Home} />
            <Redirect from="/undefined" to="/" />
            {/* <Route path="/:uid" component={Profile} /> */}
            <Route
              path="/"
              exact
              render={() =>
                this.state.shouldRedirect ? (
                  <Redirect to="/feed" />
                ) : (
                  <Redirect to="/home" />
                )
              }
            />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }
}

export default App;

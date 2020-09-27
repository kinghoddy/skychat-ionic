import React from "react";
import { IonRouterOutlet } from "@ionic/react";
import "./auth.css";
import Login from "./login";
import Signup from "./signup";
import { Route } from "react-router";
import firebase from "../../firebaseConfig";
import "firebase/auth";

const Auth: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState(false);
  const [userData, setUserData] = React.useState<any>({});
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(true);
        setUserData({
          profilePicture: user.photoURL,
          username: user.displayName,
          uid: user.uid,
        });
      }
    });
  }, []);

  return (
    <IonRouterOutlet>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* {currentUser && (
        <IonItem className="ion-margin-vertical">
          <IonAvatar>
            <img alt="" src={userData.profilePicture} />
          </IonAvatar>
          <IonLabel>
            <h2> Continue as {userData.username}</h2>
          </IonLabel>
        </IonItem>
      )}
*/}
    </IonRouterOutlet>
  );
};

export default Auth;

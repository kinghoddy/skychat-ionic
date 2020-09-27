import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonLabel,
  IonIcon,
  IonTabButton,
  IonRouterOutlet,
  IonAvatar,
  IonSpinner,
} from "@ionic/react";
import { homeOutline, notificationsOutline, menuOutline } from "ionicons/icons";
import { Route } from "react-router";
import Feed from "../../pages/feed/feed";
import firebase from "../../firebaseConfig";
import "firebase/auth";
import "firebase/database";

class Profile extends React.Component<any> {
  state = {
    loading: false,
    userData: {
      uid: "",
      username: "",
      profilePicture: "",
    },
  };
  componentDidMount() {
    this.loadUserData();
  }
  loadUserData = () => {
    this.setState({ loading: true });
    firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        localStorage.setItem("hasUsedSkychat", "true");
        const updatedUd: any = {
          username: user.displayName.toLowerCase(),
          email: user.email,
          profilePicture: user.photoURL,
          uid: user.uid,
        };
        localStorage.setItem("skychatUserData", JSON.stringify(updatedUd));
        // fetch the profile data
        const userdata: any = {
          ...this.state.userData,
        };
        for (let keys in updatedUd) {
          userdata[keys] = updatedUd[keys];
        }
        this.setState({
          userData: userdata,
          loading: false,
        });
      } else {
        localStorage.setItem("hasUsedSkychat", "false");
        this.setState({
          errorMessage: "You are not logged in",
          loading: false,
        });
        this.props.history.push("/login");
      }
    });
  };

  render() {
    return (
      <IonTabs>
        <IonRouterOutlet>
          <Route
            path="/feed"
            render={() => (
              <Feed {...this.state.userData} shouldLoad={!this.state.loading} />
            )}
          />
        </IonRouterOutlet>
        <IonTabBar style={{ height: "40px" }} slot="bottom">
          <IonTabButton tab="feed" href="/feed">
            <IonIcon icon={homeOutline} />
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonAvatar style={{ height: "28px", width: "28px" }}>
              <img alt="" src={this.state.userData.profilePicture} />
            </IonAvatar>
          </IonTabButton>
          <IonTabButton tab="comment" href="/comments">
            <IonIcon icon={notificationsOutline} />
          </IonTabButton>
          <IonTabButton tab="menu" href="/home">
            <IonIcon icon={menuOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );
  }
}

export default Profile;

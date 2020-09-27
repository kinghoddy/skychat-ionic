import React, { Component } from "react";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonLoading,
  IonPage,
  IonContent,
  IonIcon,
  IonRouterLink,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import { personCircleOutline } from "ionicons/icons";
import "./auth.css";
import "firebase/auth";
import "firebase/database";
import firebase from "../../firebaseConfig";
import { GooglePlus } from "@ionic-native/google-plus";
class Login extends Component<any> {
  state = {
    formData: {
      email: "",
      password: "",
    },
    userData: {
      uid: "",
      profilePicture: "",
      username: "",
    },
    errorMessage: null,
    sMessage: "Please Wait ! ! !",
    loading: false,
    userExist: null,
    shouldLogin: false,
    toast: "",
  };

  googleLogin = () => {
    this.setState({ errorMessage: null, loading: true });
    GooglePlus.login({
      webClientId:
        "795125035544-r52qmsadpkvlpoon8vgnjuujvi88f64g.apps.googleusercontent.com",
      offline: true,
    })
      .then((res: any) => {
        let token = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(token)
          .then((result) => {
            var user = result.user;
            if (result!.additionalUserInfo!.isNewUser === true) {
              this.setState({
                sMessage: "Finish setting up your skymail account",
              });
              this.saveUser(user);
            } else {
              this.fetchUser(user);
            }
          })
          .catch((error) => {
            var errorMessage = error.message;
            this.setState({ errorMessage: errorMessage });
          });
        console.log(res);
      })
      .catch((err) => {
        const errors: any = {
          "7": "Network error",
          "12501": "Sign in Canceled",
          "12500": "Sign in failed",
          "12502": "Sign in progress",
          "10": "Developer error",
          "20": "Connection suspended during call",
          "16": "Connection canceled",
          "15": "Connection timeout",
        };
        if (!errors[err]) {
          errors[err] = "Unknown error";
        }
        console.error(err);

        this.setState({ errorMessage: errors[err], loading: false });
      });
  };

  fetchUser = (user: any) => {
    this.setState({ sMessage: "Logging in.." });
    var uid;
    if (user != null) {
      uid = user.uid;
      this.setState({ loading: false, errorMessage: null, shouldLogin: true });
    } else {
      var errorMessage = <strong>Failed</strong>;
      this.setState({ loading: false, errorMessage: errorMessage });
    }
    if (this.state.shouldLogin) {
      var search = this.props.location.search;
      if (search) {
        this.props.history.push("/" + search.substr(1));
      } else {
        this.props.history.push("/feed");
      }
    }
  };

  saveUser = (user: any) => {
    var ref = firebase.database().ref("users/");
    const id = user.uid;

    this.setState({ loading: true, sMessage: "Completing Signup  !" });
    ref
      .child(id)
      .set({
        username: user.displayName.toLowerCase(),
        coverPhoto: "assets/avatar_red.png",
        profilePicture: user.photoURL,
      })
      .then(() => {
        this.setState({ loading: false, errorMessage: null });
        console.log("success");
        this.props.history.push(id);
      })
      .catch(() => {
        this.setState({
          loading: false,
          errorMessage: "Failed to save user to database",
        });
      });
  };

  signInHandler = (event: any) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: null });
    const formData = { ...this.state.formData };
    firebase
      .auth()
      .signInWithEmailAndPassword(formData.email, formData.password)
      .then((res) => {
        // User is signed in.
        var user = res.user;
        this.fetchUser(user);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorMessage = error.message;
        console.log(error, "error");
        this.setState({ loading: false, errorMessage: errorMessage });
        // ...
      });
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          userData: {
            profilePicture: user.photoURL,
            username: user.displayName,
            uid: user.uid,
          },
        });
      }
    });
  }

  inputChanged = (e: any, id: "email" | "password") => {
    const updatedForm = {
      ...this.state.formData,
    };
    updatedForm[id] = e!.target!.value;
    this.setState({ formData: updatedForm });
  };
  render() {
    return (
      <IonPage className="bg">
        <IonToolbar color="none">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
        <IonContent>
          <div className="wrapper">
            <IonIcon
              className="animate__rollIn wow"
              style={{ fontSize: "64px" }}
              icon={personCircleOutline}
            />

            <form
              className="ion-text-center wow animate__fadeInUp"
              onSubmit={this.signInHandler}
              style={{ width: "90%" }}
            >
              <IonLoading
                isOpen={this.state.loading}
                backdropDismiss={false}
                message={this.state.sMessage}
              />
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={this.state.formData.email}
                  onIonChange={(e) => this.inputChanged(e, "email")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={this.state.formData.password}
                  onIonChange={(e) => this.inputChanged(e, "password")}
                />
              </IonItem>
              <IonButton
                type="submit"
                color="medium"
                className="ion-margin-top"
                expand="block"
              >
                Login
              </IonButton>
              <IonButton
                onClick={this.googleLogin}
                className="ion-margin-top"
                expand="block"
              >
                <img
                  slot="start"
                  alt=""
                  src="/assets/google.png"
                  style={{ height: "90%", marginRight: "10px" }}
                />
                Continue with Google
              </IonButton>
              <p className="ion-margin-vertical">Or</p>
              <IonRouterLink routerLink="/signup">
                Create new account
              </IonRouterLink>
              {this.state.errorMessage && (
                <p className="error">{this.state.errorMessage}</p>
              )}
            </form>
            {this.state.userData.uid && (
              <IonItem
                mode="ios"
                className="ion-margin-vertical"
                color="dark"
                routerLink="/feed"
              >
                <IonAvatar slot="start">
                  <img alt="" src={this.state.userData.profilePicture} />
                </IonAvatar>
                <IonLabel>
                  <h2> Continue as {this.state.userData.username}</h2>
                </IonLabel>
              </IonItem>
            )}
            <img
              className="logo animate__fadeInUp wow animate__delay-2s"
              alt=""
              src="/assets/logo/skychat_red.png"
            />
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default withRouter(Login);

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
  IonText,
  IonToast,
} from "@ionic/react";
import { Link, withRouter } from "react-router-dom";
import {
  lockClosedOutline,
  logIn,
  logOutOutline,
  mailOutline,
  personCircleOutline,
} from "ionicons/icons";
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
          .signInWithCredential(token)
          .then((result) => {
            var user = result.user;

            if (result!.additionalUserInfo!.isNewUser === true) {
              firebase
                .auth()
                .currentUser!.delete()
                .then(() => {
                  this.setState({
                    loading: false,
                    error: (
                      <span>
                        "This Google account is not attached to any skychat
                        account.
                        <Link to="/signup">
                          <a>Create an account instead</a>
                        </Link>
                      </span>
                    ),
                  });
                });
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
          errors[err] = "Can't access google at the moment";
        }
        console.error(err);

        this.setState({ errorMessage: errors[err], loading: false });
      });
  };

  fetchUser = (user: any) => {
    this.setState({ sMessage: "Logging in.." });
    if (user != null) {
      this.setState({ loading: false, errorMessage: null });
      localStorage.removeItem("skychatUserData");
      localStorage.removeItem("skychatFeed");
      var search = this.props.location.search;
      if (search) {
        this.props.history.push("/" + search.substr(1));
      } else {
        this.props.history.push("/feed");
      }
    } else {
      var errorMessage = <strong>Failed</strong>;
      this.setState({ loading: false, errorMessage: errorMessage });
    }
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
          <IonButtons slot="start" color="light">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle color="light">Login</IonTitle>
        </IonToolbar>
        <IonContent>
          <div className="wrapper">
            <IonIcon
              className="animate__rollIn wow"
              style={{ fontSize: "64px" }}
              icon={personCircleOutline}
            />
            {this.state.userData.uid && (
              <IonItem
                mode="ios"
                className="ion-margin-vertical"
                color="dark"
                routerLink="/feed"
              >
                <IonAvatar slot="start">
                  <img
                    alt=""
                    src={this.state.userData.profilePicture}
                    onError={(e: any) => (e.target.src = "/assets/avatar.png")}
                  />
                </IonAvatar>
                <IonLabel>
                  <h2> Continue as {this.state.userData.username}</h2>
                </IonLabel>
              </IonItem>
            )}

            <form
              className="ion-text-center wow animate__fadeInUp"
              onSubmit={this.signInHandler}
              style={{ width: "100%" }}
            >
              <IonLoading
                isOpen={this.state.loading}
                backdropDismiss={false}
                message={this.state.sMessage}
              />
              <IonItem className="ion-margin-top">
                <IonIcon color="light" slot="start" icon={mailOutline} />
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={this.state.formData.email}
                  onIonChange={(e) => this.inputChanged(e, "email")}
                />
              </IonItem>
              <IonItem className="ion-margin-top">
                <IonIcon color="light" slot="start" icon={lockClosedOutline} />

                <IonLabel position="floating">Full Name</IonLabel>
                <IonInput
                  type="password"
                  required
                  value={this.state.formData.password}
                  onIonChange={(e) => this.inputChanged(e, "password")}
                />
              </IonItem>
              <IonButton
                type="submit"
                mode="ios"
                color="fav"
                className="ion-margin-top"
                expand="block"
              >
                <IonIcon icon={logIn} />
                <IonText style={{ margin: "auto" }}>Login</IonText>
              </IonButton>
              <p className="ion-margin-vertical">Or</p>
              <IonButton
                onClick={this.googleLogin}
                className="ion-margin-top"
                expand="block"
                fill="outline"
                color="light"
                mode="ios"
              >
                <img
                  alt=""
                  src="/assets/google.png"
                  style={{ height: "30px" }}
                />
                <IonText style={{ margin: "auto" }}>
                  Continue with google
                </IonText>
              </IonButton>
              <IonButton className="ion-margin-top" routerLink="/signup">
                <IonIcon icon={logOutOutline} slot="start" />
                Create new account
              </IonButton>
            </form>

            <img
              className="logo animate__fadeInUp wow animate__delay-2s"
              alt=""
              src="/assets/logo/skychat_red.png"
            />
          </div>
          <IonToast
            isOpen={this.state.errorMessage ? true : false}
            onDidDismiss={() => this.setState({ errorMessage: null })}
            message={this.state.errorMessage || ""}
            buttons={["cancel"]}
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default withRouter(Login);

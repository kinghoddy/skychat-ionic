import React, { Component } from "react";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonLoading,
  IonPage,
  IonContent,
  IonIcon,
  IonAvatar,
  IonText,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { withRouter, Link } from "react-router-dom";
import {
  mailOutline,
  lockClosedOutline,
  logInOutline,
  peopleOutline,
  closeOutline,
  checkmarkOutline,
} from "ionicons/icons";
import "./auth.css";
import "firebase/auth";
import "firebase/database";
import firebase from "../../firebaseConfig";
import { GooglePlus } from "@ionic-native/google-plus";

class SignUp extends Component<any> {
  state = {
    formData: {
      fullName: "",
      username: "",
      email: "",
      password: "",
    },
    profilePicture: "",
    errorMessage: null,
    sMessage: "Please Wait ! ! !",
    loading: false,
    setname: false,
    nameLoading: false,
    usernameExists: false,
    shouldLogin: false,
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
            var user = result.user!;
            var id = result.user!.uid;
            firebase
              .database()
              .ref("users")
              .once("value", (s) => {
                if (s.val()[id]) {
                  this.setState({
                    loading: false,
                    userExist: true,
                    errorMessage: (
                      <div>
                        <img
                          src={s.val()[id].profilePicture}
                          style={{ height: "50px", width: "50px" }}
                          className="rounded-circle"
                          alt=""
                        />
                        User {s.val()[id].username} already exists. You can
                        <Link to="/feed">
                          <a> Login </a>
                        </Link>
                        to continue
                      </div>
                    ),
                  });
                } else {
                  this.setState({ loading: false });
                  this.setState({
                    setname: true,
                    profilePicture: user.photoURL,
                  });
                }
              });
          })
          .catch((error) => {
            var errorMessage = error.message;
            this.setState({ errorMessage: errorMessage, loading: false });
          });
      })
      .catch((err: any) => {
        console.error(err);
        this.setState({
          errorMessage: "Can't access google at the moment",
          loading: false,
        });
      });
  };

  saveUser = (e: any) => {
    e.preventDefault();
    // this.setUserName(this.state.formData.username);
    this.setState({ errorMessage: null });
    if (
      !this.state.usernameExists &&
      !this.state.nameLoading &&
      this.state.formData.username &&
      this.state.formData.fullName
    ) {
      this.setState({ loading: true, sMessage: "Completing Signup  !" });
      const user = firebase.auth().currentUser!;
      user.updateProfile({
        displayName: this.state.formData.username,
      });
      var ref = firebase.database().ref("users/");
      ref.once("value", (s) => {
        const id = user.uid;
        ref
          .child(id)
          .update({
            username: this.state.formData.username,
            profilePicture: user.photoURL,
            coverPhoto: "/img/avatar-square.png",
            fullName: this.state.formData.fullName.toLowerCase(),
          })
          .then(() => {
            localStorage.removeItem("skychatUserData");
            localStorage.removeItem("skychatFeed");
            var search = this.props.location.search;
            setTimeout(() => {
              if (search) {
                this.props.history.push("/" + search.substr(1));
              } else {
                this.props.history.push("/feed");
              }
            }, 2000);
          })
          .catch(() => {
            this.setState({
              loading: false,
              errorMessage: "Failed to save user to database",
            });
          });
      });
    }
    if (this.state.usernameExists) {
      this.setState({ errorMessage: "Username Exists. Pick another" });
    }
  };
  setUsername = () => {
    let userExists;
    this.setState({ nameLoading: true });
    var ref = firebase.database().ref("users/");
    setTimeout(() => {
      ref
        .orderByChild("username")
        .equalTo(this.state.formData.username)
        .once("value", (s) => {
          if (s.val()) userExists = true;
          else userExists = false;
          this.setState({ usernameExists: userExists, nameLoading: false });
        });
    }, 1000);
  };
  signUpHandler = (event: any) => {
    event.preventDefault();
    this.setState({
      loading: true,
      sMessage: "Checking info",
      errorMessage: null,
    });
    const formData = { ...this.state.formData };
    firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then((res) => {
        var user = firebase.auth().currentUser!;
        this.setState({ sMessage: "Please wait" });
        user
          .updateProfile({
            photoURL: "/assets/avatar.png",
          })
          .then(() => {
            this.setState({
              loading: false,
              setname: true,
              profilePicture: user.photoURL,
            });
            this.setUsername();
          });
      })
      .catch((error) => {
        // Handle Errors here.
        var errorMessage = error.message;
        this.setState({ loading: false, errorMessage: errorMessage });
        // ...
      });
  };

  inputChanged = (
    e: any,
    id: "email" | "username" | "password" | "fullName"
  ) => {
    const updatedForm = {
      ...this.state.formData,
    };
    updatedForm[id] = e!.target!.value;
    if (id === "username") updatedForm[id] = sanitize(e.target.value);
    this.setState({ formData: updatedForm });
  };
  render() {
    return (
      <IonPage className="bg">
        <IonToolbar color="none">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Sign up</IonTitle>
        </IonToolbar>
        <IonContent>
          <div className="wrapper">
            <IonLoading
              isOpen={this.state.loading}
              mode="ios"
              backdropDismiss={false}
              message={this.state.sMessage}
            />

            <h4 className="headText">Join Skychat Today</h4>
            {this.state.setname ? (
              <div className="ion-text-center">
                <IonAvatar style={{ margin: "auto" }}>
                  <img
                    src={this.state.profilePicture}
                    alt=""
                    onError={(e: any) => (e.target.src = "/assets/avatar.png")}
                  />
                </IonAvatar>
                <p>{this.state.formData.email}</p>
                <h5>Pick a username</h5>
                <span>It may include '_'. </span> <br />
                <span>
                  Do not include '@' , '-' , '/' , '#' , '?' , '[] , {} , ()' ,
                  '=' or any other non alphabetic character.
                </span>
                <form
                  className="ion-text-center wow animate__fadeInUp"
                  style={{ width: "100%" }}
                >
                  <IonItem className="ion-margin-top">
                    {this.state.nameLoading ? (
                      <IonSpinner slot="end" />
                    ) : (
                      this.state.formData.username && (
                        <IonIcon
                          color="light"
                          slot="end"
                          icon={
                            this.state.usernameExists
                              ? closeOutline
                              : checkmarkOutline
                          }
                        />
                      )
                    )}
                    <IonIcon color="light" slot="start" icon={peopleOutline} />

                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput
                      type="text"
                      required
                      value={this.state.formData.username}
                      onIonChange={(e) => {
                        this.inputChanged(e, "username");
                        this.setUsername();
                      }}
                    />
                  </IonItem>
                  <IonItem className="ion-margin-top">
                    <IonIcon color="light" slot="start" icon={mailOutline} />

                    <IonLabel position="floating">Full Name</IonLabel>
                    <IonInput
                      type="text"
                      required
                      value={this.state.formData.fullName}
                      onIonChange={(e) => this.inputChanged(e, "fullName")}
                    />
                  </IonItem>
                  {!this.state.usernameExists &&
                    !this.state.nameLoading &&
                    this.state.formData.username &&
                    this.state.formData.fullName && (
                      <IonButton
                        type="submit"
                        color="fav"
                        className="ion-margin-top"
                        mode="ios"
                        expand="block"
                      >
                        Finish
                      </IonButton>
                    )}
                </form>
              </div>
            ) : (
              <form
                onSubmit={this.signUpHandler}
                className="ion-text-center wow animate__fadeInUp"
                style={{ width: "100%" }}
              >
                <IonItem className="ion-margin-top">
                  <IonIcon color="light" slot="start" icon={mailOutline} />

                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    type="email"
                    required
                    value={this.state.formData.email}
                    onIonChange={(e) => this.inputChanged(e, "email")}
                  />
                </IonItem>
                <IonItem className="ion-margin-top">
                  <IonIcon
                    color="light"
                    slot="start"
                    icon={lockClosedOutline}
                  />

                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={this.state.formData.password}
                    required
                    onIonChange={(e) => this.inputChanged(e, "password")}
                  />
                </IonItem>
                <IonButton
                  type="submit"
                  color="fav"
                  className="ion-margin-top"
                  mode="ios"
                  expand="block"
                >
                  Next
                </IonButton>
                <IonButton
                  onClick={this.googleLogin}
                  className="ion-margin-top"
                  fill="outline"
                  mode="ios"
                  color="light"
                  expand="block"
                >
                  <img
                    alt=""
                    src="/assets/google.png"
                    style={{ height: "30px" }}
                  />
                  <IonText style={{ margin: "auto" }}>
                    Continue with Google
                  </IonText>
                </IonButton>
                <p className="ion-margin-vertical text-light">
                  Already have an account ?
                </p>
                <IonButton routerLink="/login">
                  <IonIcon icon={logInOutline} slot="start" />
                  Login
                </IonButton>
              </form>
            )}
            <IonToast
              isOpen={this.state.errorMessage ? true : false}
              onDidDismiss={() => this.setState({ errorMessage: null })}
              message={this.state.errorMessage || ""}
              buttons={["cancel"]}
            />
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
const sanitize = (text = "") => {
  let sanitizedText = text
    .replace(/[-[\]{}();:'"@=<>*+?.,\\^$|#\s]/g, "")
    .trim()
    .toLowerCase();
  return sanitizedText;
};

export default withRouter(SignUp);

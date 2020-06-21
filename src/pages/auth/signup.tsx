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
} from "@ionic/react";
import { Link, withRouter } from "react-router-dom";
import { personCircleOutline } from "ionicons/icons";
import "./auth.css";
import "firebase/auth";
import "firebase/database";
import firebase from "../../firebaseConfig";
import { GooglePlus } from "@ionic-native/google-plus";

class SignUp extends Component<any> {
  state = {
    formData: {
      email: "",
      username: "",
      password: "",
    },
    errorMessage: null,
    sMessage: "Please Wait ! ! !",
    loading: false,
    userExist: null,
    name: "",
    photo: "",
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
            this.saveUser(user);
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

  fetchUser = (user: any) => {
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
    ref.once("value", (s) => {
      const id = user.uid;
      if (s.val()[id]) {
        this.setState({
          loading: false,
          userExist: user,
          photo: s.val()[id].profilePicture,
          name: s.val()[id].username,
        });
      } else {
        this.setState({ loading: true, sMessage: "Completing Signup  !" });
        ref
          .child(id)
          .set({
            username: user.displayName.toLowerCase(),
            coverPhoto:
              "https://sky-chat.netlify.app/static/media/avatar_square.8361f480.png",
            profilePicture: user.photoURL,
          })
          .then(() => {
            this.setState({ loading: false, errorMessage: null });
            this.props.history.push(id);
          })
          .catch(() => {
            this.setState({
              loading: false,
              errorMessage: "Failed to save user to database",
            });
          });
      }
    });
  };

  signUpHandler = (event: any) => {
    event.preventDefault();
    this.setState({ loading: true, sMessage: "Checking info" });
    const formData = { ...this.state.formData };
    console.log(formData);
    var ref = firebase.database().ref("users");
    ref.once("value", (s) => {
      var usernameExist = false;
      for (let keys in s.val()) {
        if (
          formData.username.toLowerCase() ===
          s.val()[keys].username.toLowerCase()
        ) {
          usernameExist = true;
          console.log(s.val()[keys].username);
        }
      }
      if (usernameExist) {
        this.setState({
          errorMessage: (
            <span>
              Username <strong>{formData.username}</strong> Exists. Please{" "}
              <strong>Pick another username</strong>
            </span>
          ),
          loading: false,
        });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(formData.email, formData.password)
          .then((res) => {
            var user = firebase.auth().currentUser!;
            this.setState({ sMessage: "Please wait" });
            user
              .updateProfile({
                displayName: formData.username.toLowerCase(),
                photoURL:
                  "https://sky-chat.netlify.app/static/media/avatar-red.6399edc5.png",
              })
              .then(() => {
                this.saveUser(user);
              })
              .catch((error) => {
                // An error happened.
                const errorMessage = "Failed to Authenticate";
                this.setState({ loading: false, errorMessage: errorMessage });
              });
          })
          .catch((error) => {
            // Handle Errors here.
            var errorMessage = error.message;
            this.setState({ loading: false, errorMessage: errorMessage });
            // ...
          });
      }
    });
  };
  componentDidMount() {}

  inputChanged = (e: any, id: "email" | "username" | "password") => {
    const updatedForm = {
      ...this.state.formData,
    };
    updatedForm[id] = e!.target!.value;
    this.setState({ formData: updatedForm });
  };
  render() {
    return (
      <IonPage>
        <IonToolbar mode="ios">
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
              message={this.state.sMessage}
            />
            <IonIcon
              className="animate__rollIn wow"
              style={{ fontSize: "64px" }}
              icon={personCircleOutline}
            />

            {this.state.userExist ? (
              <div className="ion-text-center">
                <IonAvatar slot="start">
                  <img src={this.state.photo} alt="" />
                </IonAvatar>
                <p>
                  User {this.state.name} already exists
                  <IonButton
                    fill="outline"
                    color="dark"
                    onClick={() => this.fetchUser(this.state.userExist)}
                  >
                    Login as {this.state.name}
                  </IonButton>
                  or
                  <IonButton
                    fill="outline"
                    onClick={() => this.setState({ userExists: null })}
                  >
                    Sign up with another account
                  </IonButton>
                </p>
              </div>
            ) : (
              <form
                onSubmit={this.signUpHandler}
                className="ion-text-center wow animate__fadeInUp"
                style={{ width: "75%" }}
              >
                <IonLoading
                  isOpen={this.state.loading}
                  backdropDismiss={false}
                  message={this.state.sMessage}
                />
                <IonItem>
                  <IonLabel position="floating">Username</IonLabel>
                  <IonInput
                    type="text"
                    required
                    value={this.state.formData.username}
                    onIonChange={(e) => this.inputChanged(e, "username")}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    type="email"
                    required
                    value={this.state.formData.email}
                    onIonChange={(e) => this.inputChanged(e, "email")}
                  />
                </IonItem>
                <IonItem>
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
                  color="dark"
                  className="ion-margin-top"
                  expand="block"
                >
                  Signup
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
                <p className="ion-margin-vertical">Already have an account ?</p>
                <Link to={"/login"}>Login</Link>
                {this.state.errorMessage && (
                  <p className="error">{this.state.errorMessage}</p>
                )}
              </form>
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

export default withRouter(SignUp);

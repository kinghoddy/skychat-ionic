import React, { Component } from "react";
import {
  IonPage,
  IonContent,
  IonSlide,
  IonSlides,
  IonButton,
} from "@ionic/react";
import "./home.css";
class home extends Component {
  state = {};

  render() {
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
      autoplay: {
        stopOnLastSlide: true,
        delay: 5000,
      },

      slideToClickedSlide: true,
    };
    return (
      <IonPage>
        <IonContent>
          <IonSlides pager={true} options={slideOpts}>
            <IonSlide>
              <div className="home_banner">
                <img alt="" src="/assets/slides/1.jpg" />
              </div>

              <div className="home_panel wow animate__fadeInUp">
                <h1>Hey there !! </h1>
                <p>Welcome to skychat by kinghoddy</p>
              </div>
            </IonSlide>
            <IonSlide>
              <div className="home_banner">
                <img alt="" src="/assets/slides/2.jpg" />
              </div>

              <div className="home_panel ">
                <h2>Enjoy messaging in the clouds </h2>
                <p>All user activities are stored on an online database</p>
              </div>
            </IonSlide>
            <IonSlide>
              <div className="home_banner">
                <img alt="" src="/assets/slides/3.jpg" />
              </div>

              <div className="home_panel">
                <h2>Stay connected with friends </h2>
                <p>Connect with anyone, anywhere within a buzz of a second</p>
              </div>
            </IonSlide>
            <IonSlide>
              <div className="home_banner">
                <img alt="" src="/assets/slides/4.jpg" />
              </div>

              <div className="home_panel">
                <h1>Let's Go </h1>
                <div className="ion-padding-horizontal">
                  <IonButton routerLink="/login" expand="block" mode="ios">
                    Login
                  </IonButton>
                  <IonButton
                    routerLink="signup"
                    expand="block"
                    color="dark"
                    mode="ios"
                  >
                    Signup
                  </IonButton>
                </div>
              </div>
            </IonSlide>
          </IonSlides>
        </IonContent>
      </IonPage>
    );
  }
}

export default home;

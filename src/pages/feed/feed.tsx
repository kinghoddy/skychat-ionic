import React from "react";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import Toolbar from "../../components/toolbar/toolbar";
import Post from "../../components/posts/posts";
import firebase from "../../firebaseConfig";
import "firebase/database";
import "./feed.css";
class Feed extends React.Component<any> {
  state = {
    posts: [],
    fired: false,
    loadCount: 5,
    update: false,
    loading: false,
  };
  componentDidUpdate() {
    if (this.props.shouldLoad && !this.state.fired) {
      this.setState({ fired: true });
      this.getPosts(undefined);
    }
  }

  componentDidMount() {
    const initPosts: any = localStorage.getItem("skychatFeed");
    if (initPosts) {
      this.setState({ posts: JSON.parse(initPosts) });
    }
  }
  upDateFeed = (friendsArr: any[]) => {
    const feeds = firebase.database().ref("posts");
    feeds.limitToLast(1).on("child_added", (s) => {
      if (friendsArr.indexOf(s.val().uid) > -1) {
        this.setState({ update: true });
      }
    });
  };
  getPosts = (event: CustomEvent<RefresherEventDetail> | undefined) => {
    console.log("getposts");
    this.setState({ loading: true });
    const ref = firebase.database().ref("users/");
    ref.child(this.props.uid).on("value", (s) => {
      let friendsId = s.val()["friendsId"];
      let friendsArr = [this.props.uid];
      for (let key in friendsId) {
        friendsArr.push(friendsId[key]);
      }
      this.upDateFeed(friendsArr);
      const feedRef = firebase.database().ref("posts/");
      let Posts: any[] = [];
      friendsArr.forEach((cur, i) => {
        feedRef
          .orderByChild("uid")
          .equalTo(cur)
          .limitToLast(100)
          .once("value", (s) => {
            for (let key in s.val()) {
              let post = {
                ...s.val()[key],
                id: key,
              };
              Posts.push(post);
              localStorage.setItem(
                "skychatFeed",
                JSON.stringify(Posts.reverse())
              );
            }
            if (friendsArr.length - 1 >= i) {
              setTimeout(() => {
                event?.detail.complete();
                this.setState({
                  posts: Posts.reverse(),
                  updated: false,
                  loading: false,
                });
              }, 1000);
            }
          });
      });
    });
  };

  loadMore = (e: any) => {
    let count = this.state.loadCount;
    count += 10;
    const watch = document.getElementById("watch")!;
    if (watch?.getBoundingClientRect().top < window.innerHeight) {
      this.setState({ loadCount: count });
    }
  };
  scrolled = () => {
    let vidArr = Array.from(
      document.querySelectorAll<HTMLVideoElement>(".video_container video")
    );
    vidArr.forEach((videos) => {
      if (
        videos.getBoundingClientRect().top <= 300 &&
        videos.getBoundingClientRect().top > 0
      ) {
        videos.play();
      } else {
        videos.pause();
      }
    });
  };
  render() {
    let posts: any[] = this.state.posts;
    posts.sort((a, b) => {
      return b.date - a.date;
    });
    return (
      <IonPage>
        <Toolbar />
        <IonContent
          forceOverscroll={true}
          scrollEvents={true}
          onIonScroll={(e) => {
            this.loadMore(e);
            this.scrolled();
          }}
        >
          <IonRefresher slot="fixed" onIonRefresh={this.getPosts}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="feed">
            {this.state.posts.map(
              (cur: any, i: number) =>
                i < this.state.loadCount && (
                  <Post key={cur.id} {...cur} likeeId={this.props.uid} />
                )
            )}
            <p className="ion-text-center" id="watch"></p>

            {(this.state.loading || !this.state.fired) && (
              <div className="ion-padding ion-text-center">
                <IonSpinner />
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default Feed;

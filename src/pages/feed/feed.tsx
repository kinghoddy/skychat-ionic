import React from "react";
import { IonPage, IonContent, IonSpinner } from "@ionic/react";
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
    loading: false,
  };
  componentDidUpdate() {
    if (this.props.shouldLoad && !this.state.fired) {
      this.setState({ fired: true });
      this.getPosts();
    }
  }
  componentDidMount() {
    const initPosts: any = localStorage.getItem("skychatFeed");
    if (initPosts) {
      this.setState({ posts: JSON.parse(initPosts) });
    }
  }
  getPosts = () => {
    console.log("getposts");
    this.setState({ loading: true });
    const ref = firebase.database().ref("users/");
    ref.child(this.props.uid).on("value", (s) => {
      let friendsId = s.val()["friendsId"];
      let friendsArr = [this.props.uid];
      for (let key in friendsId) {
        friendsArr.push(friendsId[key]);
      }
      const feedRef = firebase.database().ref("posts/");
      let Posts: any[] = [];
      friendsArr.forEach((cur, i) => {
        feedRef
          .orderByChild("uid")
          .equalTo(cur)
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
            if (friendsArr.length - 1 === i) {
              setTimeout(() => {
                this.setState({ posts: Posts.reverse(), loading: false });
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
          onIonScroll={this.loadMore}
        >
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

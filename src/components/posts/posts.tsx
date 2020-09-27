import React from "react";
import "./posts.css";
import firebase from "../../firebaseConfig";
import "firebase/database";
import {
  IonItem,
  IonAvatar,
  IonLabel,
  IonImg,
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonActionSheet,
} from "@ionic/react";
import dateFormat from "../date";
import {
  heartOutline,
  chatbubbleEllipsesOutline,
  paperPlaneOutline,
  heart,
  ellipsisVertical,
  trash,
  pencilOutline,
  copyOutline,
  closeOutline,
  shareSocialOutline,
  refreshCircleOutline,
  refreshOutline,
} from "ionicons/icons";
import { SocialSharing } from "@ionic-native/social-sharing";
import Video from "./video_small";
class APost extends React.Component<any> {
  state: any = {
    post: {
      title: "",
      username: "",
      src: "",
      body: "",
      date: "",
    },
    openActionSheet: false,
    loading: false,
    likesLoading: false,
    vidPoster: "/assets/slides/4.jpg",
    likes: [],
    comments: [],
    commentsLength: 0,
    likesLength: 0,
    liked: null,
    shares: [],
    sharesLength: 0,
    likeeId: null,
    lastLike: null,
    isMine: false,
  };
  like = () => {
    if (this.state.likeeId) {
      const ref = firebase
        .database()
        .ref("posts/" + this.props.id + "/likes/" + this.state.likeeId);
      if (this.state.liked) {
        this.setState({ liked: null });
        ref.set(null);
      } else {
        ref.set(Date.now());
        this.setState({ liked: true });
      }
    } else {
      this.presentToastWithOptions(
        "Network error",
        "check internet connection and try again",
        "dark"
      );
    }
  };
  async presentToastWithOptions(
    header: string,
    message: string,
    color: string
  ) {
    const toast = document.createElement("ion-toast");
    toast.header = header;
    toast.color = color;
    toast.message = message;
    toast.duration = 1500;
    toast.buttons = ["Ok"];
    document.body.appendChild(toast);
    return toast.present();
  }
  getComments = () => {
    this.setState({ commentsLoading: true });
    let commentsLength = 0;
    if (this.props.comments) {
      commentsLength = Object.keys(this.props.comments).length;
      this.setState({ commentsLength: commentsLength });
    }
    firebase
      .database()
      .ref("posts/" + this.props.id + "/comments")
      .on("value", (s) => {
        this.setState({ commentsLength: s.numChildren() });
      });
  };
  getLikes = () => {
    firebase
      .database()
      .ref("posts/" + this.props.id + "/likes")
      .on("value", (snap) => {
        this.setState({ likesLoading: true });
        let Likes: any[] = [];
        this.setState({ likesLength: snap.numChildren() });
        if (snap.val()) {
          for (let keys in snap.val()) {
            if (keys === this.state.likeeId) {
              this.setState({ liked: true });
            }
            firebase
              .database()
              .ref("users/" + keys)
              .once("value", (s) => {
                let user = s.val();
                if (user) {
                  Likes.push({ ...user, date: snap.val()[keys] });
                  Likes.sort((a, b) => {
                    return b.date - a.date;
                  });
                  const lastLikes = Likes[0];
                  this.setState({
                    likes: Likes.reverse(),
                    lastLike: lastLikes,
                    likesLoading: false,
                  });
                }
              });
          }
        }
      });
  };
  getPost = () => {
    let likesLength = 0;
    if (this.props.likes) {
      likesLength = Object.keys(this.props.likes).length;
    }

    let networkState = window.navigator.onLine;
    this.setState({
      loading: networkState,
      post: { ...this.props, body: formatLink(this.props.body) },
      likesLength: likesLength,
    });

    // createThumb();
    firebase
      .database()
      .ref("posts/" + this.props.id)
      .once("value", (s) => {
        let post = { ...this.state.post };
        for (let keys in post) {
          post[keys] = s.val()[keys];
        }
        post.body = formatLink(s.val().body);

        firebase
          .database()
          .ref("users/" + post.uid)
          .once("value", (snap) => {
            post.username = snap.val().username;
            post.icon = snap.val().profilePicture;
            this.setState({ loading: false, post: post });
          })
          .catch(() => {
            this.setState({ loading: false });
          });
      })
      .catch(() => {
        console.log("load failed");
        this.setState({ loading: false });
      });
  };
  componentDidUpdate() {
    if (this.props.likeeId !== this.state.likeeId) {
      this.setState({ likeeId: this.props.likeeId });
    }
  }
  componentDidMount() {
    let uD = localStorage.getItem("skychatUserData");
    if (uD) {
      let userData = JSON.parse(uD);
      this.setState({ likeeId: userData.uid });
      if (this.props.uid === userData.uid) {
        this.setState({ isMine: true });
      }
    }
    this.getPost();
    this.getLikes();
    this.getComments();
  }
  deletePost = () => {
    const buttons = [
      {
        role: "cancel",
        text: "Cancel",
      },
      {
        role: "destructive",
        text: "Delete",
        handler: () => {
          firebase
            .database()
            .ref("posts/" + this.props.id)
            .set(null);
        },
      },
    ];
    presentAlert(
      "",
      "Are you sure you want to dele this post ?",
      "Action cannot be reversed",
      buttons
    );
  };
  sharePost = () => {
    let temp = document.createElement("div");
    temp.innerHTML = this.state.post.title + "<br/>" + this.state.post.body;
    var options = {
      message: temp.textContent!,
      subject: "Skychat", // fi. for email
      // files: this.state.post.src ? [this.state.post.src.split('?')[0]] : undefined, // an array of filenames either locally or remotely
      url: "https://sky-chat.netlify.com/posts/" + this.props.id,
      chooserTitle: "Shared from skychat by kinghoddy", // Android only, you can override the default share sheet title
    };
    console.log(options);
    SocialSharing.shareWithOptions(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  copyLink = () => {
    window.navigator.clipboard
      .writeText("https://sky-chat.netlify.com/post/" + this.props.id)
      .then((res) => {
        this.presentToastWithOptions("Link copied to clipboard", "", "dark");
      });
  };
  editPost = () => {};
  render() {
    let buttons = [
      {
        icon: refreshOutline,
        text: "Reload Post",
        handler: () => {
          if (!window.navigator.onLine) {
            this.presentToastWithOptions("You are offline", "", "secondary");
          }
          this.getPost();
        },
      },
      {
        icon: pencilOutline,
        text: "Edit",
        handler: () => {
          this.editPost();
        },
      },
      {
        icon: shareSocialOutline,
        text: "Share",
        handler: () => {
          this.sharePost();
        },
      },
      {
        icon: copyOutline,
        text: "Copy link",
        handler: () => {
          this.copyLink();
        },
      },
      {
        role: "destructive",
        icon: trash,
        text: "Delete Post",
        handler: () => {
          this.deletePost();
          console.log("fired");
        },
      },
      {
        role: "cancel",
        icon: closeOutline,
        text: "cancel",
      },
    ];
    if (!this.state.isMine) {
      buttons = [
        {
          icon: refreshOutline,
          text: "Reload Post",
          handler: () => {
            if (!window.navigator.onLine) {
              this.presentToastWithOptions("You are offline", "", "secondary");
            }
            this.getPost();
          },
        },
        {
          icon: shareSocialOutline,
          text: "Share",
          handler: () => {
            this.sharePost();
          },
        },
        {
          icon: copyOutline,
          text: "Copy link",
          handler: () => {
            this.copyLink();
          },
        },
        {
          role: "cancel",
          icon: closeOutline,
          text: "cancel",
        },
      ];
    }
    return (
      <div className="post">
        <IonItem lines="none">
          <IonAvatar slot="start">
            {this.state.loading ? (
              <IonSkeletonText animated />
            ) : (
              <img alt="" src={this.state.post.icon} />
            )}
          </IonAvatar>
          <IonLabel>
            <h2>{this.state.post.username}</h2>
            <h3 className="text-medium">
              {this.state.loading ? (
                <IonSkeletonText animated style={{ width: "70%" }} />
              ) : (
                dateFormat(this.state.post.date)
              )}
            </h3>
          </IonLabel>
          <IonButton
            onClick={() => this.setState({ openActionSheet: true })}
            slot="end"
            fill="clear"
            shape="round"
            color="dark"
          >
            <IonIcon slot="icon-only" icon={ellipsisVertical} />
          </IonButton>
        </IonItem>
        {this.state.post.title && (
          <h4 className="post_title">{this.state.post.title}</h4>
        )}
        {this.state.post.body && (
          <p
            className="post_body"
            dangerouslySetInnerHTML={{ __html: this.state.post.body }}
          ></p>
        )}

        {this.state.post.src ? (
          this.state.post.type === "video" ? (
            <div className="post_media animate__animated animate__fadeIn">
              <Video src={this.state.post.src} poster={this.state.vidPoster} />
            </div>
          ) : (
            <div className="post_media animate__animated animate__fadeIn">
              {this.state.loading ? (
                <IonSkeletonText animated style={{ height: "300px" }} />
              ) : (
                <IonImg src={this.state.post.src} alt="" />
              )}
            </div>
          )
        ) : null}
        <div className="post_buttons">
          {/* <IonButtons> */}
          <IonButton
            onClick={this.like}
            slot="icononly"
            fill="clear"
            color={this.state.liked ? "secondary" : "dark"}
          >
            <IonIcon icon={this.state.liked ? heart : heartOutline} />
          </IonButton>
          <IonButton slot="icononly" fill="clear" color="dark">
            <IonIcon icon={chatbubbleEllipsesOutline} />
          </IonButton>
          <IonButton slot="icononly" fill="clear" color="dark">
            <IonIcon icon={paperPlaneOutline} />
          </IonButton>
          {/* </IonButtons> */}
        </div>
        <div className="post_info">
          <span>
            <strong className="ion-text-capitalize px-1">
              {this.state.likesLength}
            </strong>{" "}
            Like{this.state.likesLength !== 1 ? "s" : null}
          </span>
          <span>
            <strong className="ion-text-capitalize px-1">
              {this.state.commentsLength}
            </strong>{" "}
            Comment{this.state.commentsLength !== 1 ? "s" : null}
          </span>
          <span>
            <strong className="ion-text-capitalize px-1">
              {this.state.sharesLength}
            </strong>{" "}
            Share{this.state.sharesLength !== 1 ? "s" : null}
          </span>
        </div>
        <IonActionSheet
          isOpen={this.state.openActionSheet}
          header="Actions"
          mode="md"
          onDidDismiss={() => this.setState({ openActionSheet: false })}
          buttons={buttons}
        />
      </div>
    );
  }
}
function presentAlert(
  header: string | undefined,
  subHeader: string | undefined,
  message: string | undefined,
  buttons: any
) {
  const alert = document.createElement("ion-alert");
  alert.header = header;
  alert.subHeader = subHeader;
  alert.message = message;
  alert.buttons = buttons;

  document.body.appendChild(alert);
  return alert.present();
}

const formatLink = (body: string) => {
  let returnedBody = body;
  let bodyArr = body.split("<br/>").join(" ").split(" ");
  const ident = ["http", "www", ".com", ".ng", ".ga", ".uk", ".net", ".org"];
  bodyArr.forEach((cur: string) => {
    ident.forEach((el) => {
      if (cur.indexOf(el) > -1) {
        const link = `<a href=${cur}>${cur}</a>`;
        returnedBody = body.split(cur).join(link);
      }
    });
  });
  return returnedBody;
};

export default APost;

import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { play, pause, volumeOff, volumeHigh } from "ionicons/icons";
import "./video_small.css";

class VidSmall extends React.Component<any> {
  private Vid: React.RefObject<HTMLVideoElement>;
  constructor(props: any) {
    super(props);
    this.Vid = React.createRef();
  }
  state = {
    play: false,
    mute: false,
  };
  componentDidUpdate() {}
  componentDidMount() {
    let videos = this.Vid.current!;
    videos.addEventListener("play", (e: any) => {
      this.setState({ play: true });
    });
    videos.addEventListener("pause", (e: any) => {
      this.setState({ play: false });
    });
    let funcPlay = () => {
      if (
        videos.getBoundingClientRect().top <= 300 &&
        videos.getBoundingClientRect().top > 0
      ) {
        videos.play();
      } else {
        videos.pause();
      }
    };
    funcPlay();
  }
  playPause = () => {
    if (this.Vid.current!.paused || this.Vid.current!.ended) {
      this.Vid.current!.play();
      this.setState({ play: true });
    } else {
      this.Vid.current!.pause();
      this.setState({ play: false });
    }
  };
  muteUnmute = () => {
    if (this.Vid.current!.muted) {
      this.Vid.current!.muted = false;
      this.setState({ mute: false });
    } else {
      this.setState({ mute: true });
      this.Vid.current!.muted = true;
    }
  };
  render() {
    return (
      <div className="video_container">
        <video
          className={this.state.play ? "playing" : ""}
          src={this.props.src}
          ref={this.Vid}
          preload="auto"
          poster={this.props.poster}
        />
        <div className="controls">
          <IonButton
            slot="icon-only"
            fill="clear"
            onClick={this.playPause}
            shape="round"
          >
            <IonIcon icon={this.state.play ? pause : play} />
          </IonButton>
          <IonButton
            slot="icon-only"
            fill="clear"
            shape="round"
            onClick={this.muteUnmute}
          >
            <IonIcon icon={this.state.mute ? volumeOff : volumeHigh} />
          </IonButton>
        </div>
      </div>
    );
  }
}

export default VidSmall;

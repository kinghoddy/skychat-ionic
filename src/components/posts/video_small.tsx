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
      this.Vid.current!.volume = 1;
    } else {
      this.Vid.current!.volume = 0;
    }
  };
  render() {
    return (
      <div className="video_container">
        <video
          src={this.props.src}
          loop
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

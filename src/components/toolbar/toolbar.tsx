import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { chatbubbleOutline } from "ionicons/icons";

const Toolbar: React.FC = () => {
  return (
    <IonHeader mode="ios">
      <IonToolbar mode="ios">
        <img src="/assets/logo/skychat_red.png" style={{ height: "20px" }} />
        <IonButtons slot="end">
          <IonButton>
            <IonIcon icon={chatbubbleOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Toolbar;

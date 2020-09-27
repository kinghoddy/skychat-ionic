import firebase from './firebaseConfig';
import 'firebase/database'
const ref = firebase.database().ref('/');
const body = document.body



const cleanUp = () => {
    ref.child('users/').once('value', s => {
        console.log(s.val())
        for (let keys in s.val()) {
            if (!s.val()[keys].username) {
                console.log(s.val()[keys], keys)
                firebase.database().ref('users/' + keys).remove()
            }

        }
    })
}

const Update = () => {
    // ref.child('mobile/version').on('value', s => {
    //     let version = '1.0.1';
    //     const onlineVersion = s.val();
    //     if (version !== onlineVersion) {
    //         const buttons = [
    //             {
    //                 text: 'Cancel',
    //                 role: 'cancel',
    //                 handler: (blah) => {
    //                     console.log('Confirm Cancel: blah');
    //                 }
    //             }, {
    //                 text: 'Update',
    //                 handler: () => {
    //                     const { Browser } = Plugins;
    //                     Browser.open({ url: 'https://kinghoddy.now.sh/projects/GPPCR Mobile', toolbarColor: '#555' });
    //                 }
    //             }
    //         ];
    //         presentAlert('New version available', 'Update GPPCR Mobile to  ' + onlineVersion, buttons)
    //     }

    // })
}


(function init() {
    // cleanUp();
    Update()
})()


function presentAlert(header, message, buttonss) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = header;
    alert.message = message;
    alert.buttons = buttonss;
    document.body.appendChild(alert);
    return alert.present();
}


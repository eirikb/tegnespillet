import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyDXcMe30cGMmHg_fiUIT1DBhgHMeK7ECq0",
    authDomain: "drawesome-fd8ec.firebaseapp.com",
    databaseURL: "https://drawesome-fd8ec.firebaseio.com",
    storageBucket: "drawesome-fd8ec.appspot.com",
    messagingSenderId: "61685273325"
};
firebase.initializeApp(config);
const db = firebase.database();
export default {
    fb: firebase,
    auth: firebase.auth(),
    db: db,
    storage: firebase.storage(),
    // get: url => window.fetch(`https://drawesome-fd8ec.firebaseio.com/${url}`).then(res => res.json()),
    stamp: () => db.ref('.info/serverTimeOffset').once('value').then(res => res.val()),
    TIMESTAMP: firebase.database.ServerValue.TIMESTAMP,
    once: ref => db.ref(ref).once('value').then(res => res.val()),
    on: (ref, cb) => db.ref(ref).on('value', res => {
        let val = res.val();
        if (Array.isArray(val)) {
            val = val.reduce((o, v, i) => {
                o[i] = v;
                return o;
            }, {});
        }
        cb(val);
    })
};

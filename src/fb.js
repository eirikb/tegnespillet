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

export const db = firebase.database();

export const auth = firebase.auth();

export const once = ref => db.ref(ref).once('value').then(res => res.val());

export const on = (ref, cb) => db.ref(ref).on('value', res => {
    let val = res.val();
    if (Array.isArray(val)) {
        val = val.reduce((o, v, i) => {
            o[i] = v;
            return o;
        }, {});
    }
    cb(val);
});

export const stamp = () => db.ref('.info/serverTimeOffset').once('value').then(res => res.val());

export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let dirty = false;

const config = {
  apiKey: "AIzaSyCPog6OGIumA6XtRPXWwEjiz7G4t1uyE8c",
  authDomain: "tegnespillet-3493f.firebaseapp.com",
  databaseURL: "https://tegnespillet-3493f.firebaseio.com",
  storageBucket: "tegnespillet-3493f.appspot.com",
  messagingSenderId: "164552759843"
};
firebase.initializeApp(config);

export const db = firebase.database();

export const storage = firebase.storage();

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
  if (!dirty) cb(val);
  else console.log('was dirty');
  dirty = false;
});

export const update = (ref, value) => {
  dirty = true;
  return db.ref(ref).update(value);
};

export const stamp = () => db.ref('.info/serverTimeOffset').once('value').then(res => res.val());

export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;

export const fetchPin = () => {
  let pin = Math.floor(1000 + Math.random() * 9000);
  let ref = db.ref(`pin/${pin}`);
  return ref.transaction(pino => pino === null || Date.now() - pino.stamp > 10 * 60 * 1000 ? {
      stamp: Date.now()
    } : undefined)
    .then(res => res.committed ? {
      pin,
      ref
    } : fetchPin());
};

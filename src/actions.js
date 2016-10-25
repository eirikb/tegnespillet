import fb from './fb';
import toBlob from 'canvas-to-blob';

export const auth = () => dispatch =>
  fb.auth.onAuthStateChanged(user => {
    if (!user) {
      fb.auth.signInAnonymously();
    } else {
      dispatch({
        type: 'AUTHENTICATED',
        uid: user.uid
      });
      fb.once(`users/${user.uid}/nick`).then(n => dispatch({
        type: 'NICK',
        nick: n
      }));
    }
  });

export const setNick = (uid, nick) =>
  fb.db.ref(`users/${uid}`).update({ nick });

export const getGameByPin = pin => fb.once(`pin/${pin}`);

const fetchPin = () => {
  let pin = Math.floor(1000 + Math.random() * 9000);
  let ref = fb.db.ref(`pin/${pin}`);
  return ref.transaction(pino => pino === null || Date.now() - pino.stamp > 10 * 60 * 1000 ? {
      stamp: Date.now()
    } : undefined)
    .then(res => res.committed ? {
      pin,
      ref
    } : fetchPin());
};

export const createGame = (uid) => {
  return fetchPin().then(res => {
    const ref = fb.db.ref('game').push({
      pin: res.pin,
      owner: uid
    });
    return res.ref.update({
      game: ref.key
    }).then(() => ref.key);
  });
};

const pickTime = 5000;
const drawTime = 10000;
const guessTime = 10000;
let t1;
const onRound = (dispatch, getState) => {
  let state = getState();
  let diff = Date.now() - state.ping + getState().stamp;
  console.log('diff', diff);
  if (t1) {
    clearTimeout(t1);
  }
  let timeout;
  let pick = 0;
  if (state.round === 0) {
    pick = pickTime;
  }

  if (diff < pick) {
    dispatch({ type: 'PICK' });
    timeout = pick - diff;
  } else if (diff < pick + drawTime) {
    dispatch({ type: 'DRAW' });
    timeout = pick + drawTime - diff;
  } else if (diff < pick + drawTime + guessTime) {
    dispatch({ type: 'GUESS' });
    timeout = pick + drawTime + guessTime - diff;
  } else {
    dispatch({ type: 'LOBBY' });
  }

  if (timeout) {
    t1 = setTimeout(() => {
      onRound(dispatch, getState);
    }, timeout + 500);
  }
};

export const joinGame = (uid, key) => (dispatch, getState) => {
  dispatch({ type: 'JOIN_GAME', key: key });
  fb.db.ref(`game/${key}/users/${uid}`).set(true);

  fb.once(`game/${key}/pin`).then(pin => dispatch({ type: 'PIN', pin: pin }));
  fb.once(`game/${key}/owner`).then(owner => dispatch({ type: 'OWNER', owner: owner === uid }));
  fb.stamp().then(stamp => dispatch({ type: 'STAMP', stamp: stamp }));


  let users = [];
  fb.on(`game/${key}/users`, us => {
    if (!us) return;
    users.forEach(u => u.off('value'));
    users = Object.keys(us).map(uid => {
      let ref = fb.db.ref(`users/${uid}`);
      ref.on('value', uu => dispatch({ type: 'USER', uid: uid, nick: uu.val().nick }));
      return ref;
    });
  });

  fb.on(`game/${key}/hack`, hack => dispatch({ type: 'HACK', hack }));

  fb.on(`game/${key}/results`, results => {
    onRound(dispatch, getState);
    dispatch({ type: 'RESULTS', results });
  });

  // fb.on(`game/${key}/round`, round => {
  //   if (!round) {
  //     dispatch({ type: 'ROUND', id: -1 });
  //     return;
  //   }
  //   dispatch({ type: 'ROUND', id: round.id, ping: round.ping });
  //   onRound(dispatch, getState);
  // });

  // fb.on(`game/${key}/rounds`, rounds => {
  //   dispatch({ type: 'ROUNDS', rounds });
  // });
};

export const startGame = (key, users, round) => {
  round = (round + 1) % (Object.keys(users).length - 2);
  round = isNaN(round) ? 0 : round;
  let ref = fb.db.ref(`game/${key}/results`);
  if (round === 0) ref.set({ round, ping: fb.TIMESTAMP });
  else ref.update({ round, ping: fb.TIMESTAMP });
};

// export const pick = (key, uid, round, word) =>
//   fb.db.ref(`game/${key}/rounds/${round}/${uid}`).update({ word });

// export const drawing = (key, uid, round, drawing) =>
//   fb.db.ref(`game/${key}/rounds/${round}/${uid}`).update({ drawing });

export const answer = (key, round, pos, value) =>
  fb.db.ref(`game/${key}/rounds/${round}/${pos}`).update({ value });

export const fetchWords = count =>
  fb.once('words/norsk')
  .then(res => Object.values(res))
  .then(words => Array.from(Array(count).keys()).map(() => words.splice(Math.random() * words.length, 1)[0]));

export const setWord = (key, uid, pos, word) =>
  fb.db.ref(`game/${key}/results/${pos}`).set({ word, owner: uid });

export const setGuess = (path, uid, guess) => {
  fb.db.ref(path).set(guess);
  fb.db.ref(`${path}-by`).set(uid);
};

export const setDrawing = (path, uid, data) => {
  let blob = toBlob(data);
  fb.storage.ref().child(`${path}.jpg`).put(blob)
    .then(res => res.downloadURL)
    .then(drawing => {
      fb.db.ref(path).set(drawing);
      fb.db.ref(`${path}-by`).set(uid);
    });
};

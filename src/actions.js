import fb from './fb';

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

export const getGameByPin = pin =>  fb.once(`pin/${pin}`);

const getPin = () => {
  let pin = Math.floor(1000 + Math.random() * 9000);
  let ref = fb.db.ref(`pin/${pin}`);
  return ref.transaction(pino => pino === null || Date.now() - pino.stamp > 10 * 60 * 1000 ? {
      stamp: Date.now()
    } : undefined)
    .then(res => res.committed ? {
      pin,
      ref
    } : getPin());
};

export const createGame = (uid) => {
  return getPin().then(res => {
    const ref = fb.db.ref('game').push({
      pin: res.pin
    });
    return res.ref.update({
      game: ref.key
    }).then(() => ref.key);
  });
};

export const joinGame = (dispatch, uid, key) => {
  dispatch({ type: 'JOIN_GAME', key: key });
  fb.db.ref(`game/${key}/users/${uid}`).set(true);

  // fb.once(`game/${key}/pid`).then(pid => dispatch({ type: 'PID', pid: pid }));
  // fb.on(`game/${key}/current`, current => dispatch({ type: 'OWNER', owner: current === uid, current: current }));
  // fb.on(`game/${key}/users`, users => {
  //   Promise.all(
  //       Object.keys(users).map(user =>
  //         fb.once(`users/${user}/nick`)
  //         .then(nick => ({ uid: user, nick: nick }))))
  //     .then(users => users.reduce((o, u) => { o[u.uid] = u; return o; }, {}))
  //     .then(users => dispatch({ type: 'USERS', users: users }));
  // });
  // fb.on(`game/${key}/result`, result => {
  //   if (!result) return;
  //   dispatch({ type: 'RESULT_LIST', result });
  // });
  // fb.on(`game/${key}/score`, score => {
  //   if (!score) return;
  //   dispatch({ type: 'SET_SCORE', score });
  // });
  // let path;
  // fb.on(`game/${key}/path`, p => {
  //   if (!p) return;
  //   path = p;
  //   fb.once(`qs/${path}/cat`).then(cat => dispatch({ type: 'SET_CAT', cat }));
  // });

  // pstamp.then(stamp => fb.on(`game/${key}/q`, q => {
  //   if (!q) return;
  //   dispatch({ type: 'Q', q });
  //   onQ(dispatch, path, stamp, q);
  // }));
};
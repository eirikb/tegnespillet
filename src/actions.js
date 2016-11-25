import fb from './fb';
import toBlob from 'canvas-to-blob';

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

export const startGame = (key, users, round, done) => {
  round++;
  if (isNaN(round) || done === true) round = 0;
  fb.db.ref(`game/${key}/round`).set({ round, ping: fb.TIMESTAMP });
};

export const fetchWords = count =>
  fb.once('words/norsk')
  .then(res => Object.values(res))
  .then(words => Array.from(Array(count).keys()).map(() => words.splice(Math.random() * words.length, 1)[0]));

export const setWord = (key, uid, pos, word) =>
  fb.db.ref(`game/${key}/results/${pos}`).set({ word, owner: uid });

export const setGuess = (path, uid, guess) => {
  if (!path) return;
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

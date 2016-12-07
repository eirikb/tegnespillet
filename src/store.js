import Vue from 'vue';
import Vuex from 'vuex';
import { db, auth, on, once, stamp, storage, TIMESTAMP } from './fb';
import toBlob from 'canvas-to-blob';

const pickTime = 5000;
const drawTime = 30000;
const guessTime = 30000;
const maxTime = pickTime + drawTime + guessTime;

const fetchPin = () => {
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

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: window.location.hash.match('words') ? 'words' : 'auth',
    key: '',
    uid: '',
    word: '',
    drawing: '',
    pin: null,
    nick: '',
    pos: 0,
    nextPos: 0,
    round: 0,
    users: null,
    words: null,
    stamp: 0,
    timer: false
  },

  mutations: {
    authenticated(state, uid) {
      state.name = 'lobby';
      state.uid = uid;
    },

    nick(state, nick) {
      state.nick = nick;
    },

    joinGame(state, key) {
      state.name = 'game-lobby';
      state.key = key;
    },

    stamp(state, stamp) {
      state.stamp = stamp;
    },

    go(state, name) {
      state.name = name;
    },

    words(state, words) {
      state.words = words;
    },

    startTimer(state) {
      state.name = 'pick';
      state.timer = true;
    },

    stopTimer(state) {
      state.name = 'game-lobby';
      state.timer = false;
    },

    game(state, game) {
      Object.assign(state, game);

      let keys = Object.keys(state.users || {});
      keys.sort();
      state.pos = (keys.indexOf(state.uid) + state.round * 2) % keys.length;
      state.nextPos = (keys.indexOf(state.uid) + state.round * 2 + 1) % keys.length;

      let res = state.results[state.pos];
      let nextRes = state.results[state.nextPos];

      state.word = state.round === 0 ? res.word : res[`guess-${state.round}`];
      state.drawing = nextRes[`draw-${state.round}`];

      state.isOwner = state.owner === state.uid;
      state.isDone = state.round > 0 && Math.floor(Object.keys(state.users || {}).length / 2) === state.round + 1;
    }
  },

  actions: {
    auth({ commit, dispatch }) {
      auth.onAuthStateChanged(user => {
        if (!user) {
          auth.signInAnonymously();
        } else {
          commit('authenticated', user.uid);
          once(`users/${user.uid}/nick`).then(nick => commit('nick', nick));
        }
      });
    },

    nick({ state }) {
      db.ref(`users/${state.uid}`).update({ nick: state.nick });
    },

    createGame({ state }) {
      return fetchPin().then(res => {
        const ref = db.ref('game').push({
          pin: res.pin,
          owner: state.uid
        });
        return res.ref.update({
          game: ref.key
        }).then(() => ref.key);
      });
    },

    startGame({ state }) {
      let round = state.round;
      let done = state.done;
      round++;
      if (isNaN(round) || done === true) round = 0;
      db.ref(`game/${state.key}`).update({ round, ping: TIMESTAMP });
    },

    fetchWords({ commit }, count) {
      return once('words/norsk')
        .then(res => Object.values(res))
        .then(words => Array.from(Array(count).keys()).map(() => words.splice(Math.random() * words.length, 1)[0]))
        .then(words => commit('words', words));
    },

    pickWord({ state }, word) {
      db.ref(`game/${state.key}/results/${state.pos}`)
        .set({ word, owner: state.uid });
    },

    guess({ state }, guess) {
      const path = `game/${state.key}/results/${state.nextPos}/draw-${state.round + 1}`;
      db.ref(path).set(guess);
      db.ref(`${path}-by`).set(state.uid);
    },

    setDrawing({ state }, data) {
      const blob = toBlob(data);
      const path = `game/${state.key}/results/${state.pos}/draw-${state.round}`;
      storage.ref().child(`${path}.jpg`).put(blob)
        .then(res => res.downloadURL)
        .then(drawing => {
          db.ref(path).set(drawing);
          db.ref(`${path}-by`).set(state.uid);
        });
    },

    getGameByPin({}, pin) {
      return once(`pin/${pin}`).then(res => (res || {}).game);
    },

    round({ state, commit }) {
      let diff = Date.now() - state.ping + state.stamp;
      if (state.timer || isNaN(diff) || diff >= maxTime) return;

      commit('startTimer');
      setTimeout(() => commit('go', 'draw'), pickTime - diff);
      setTimeout(() => commit('go', 'guess'), pickTime + drawTime - diff);
      setTimeout(() => commit('stopTimer'), maxTime - diff);
    },

    joinGame({ dispatch, commit, state }, key) {
      db.ref(`game/${state.key}/users/${state.uid}`).set(state.nick);
      stamp().then(stamp => commit('stamp', stamp));

      commit('joinGame', key);
      on(`game/${key}`, game => {
        commit('game', game);
        dispatch('round');
      });
    }
  }
});

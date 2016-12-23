import Vue from 'vue';
import Vuex from 'vuex';
import {
  db,
  auth,
  on,
  once,
  stamp,
  storage,
  TIMESTAMP,
  fetchPin
}
from './fb';
import toBlob from 'canvas-to-blob';
import {
  results,
  guess,
  draw,
  pick,
  gameLobby
}
from './demo';

const pickTime = 5000;
const drawTime = 30000;
const guessTime = 30000;

Vue.use(Vuex);

export default new Vuex.Store({

  // state: guess,

  state: {
    name: window.location.hash.match('words') ? 'words' : 'auth',
    key: '',
    uid: '',
    word: '',
    drawing: '',
    pin: null,
    nick: '',
    pos: 0,
    round: null,
    nextPos: 0,
    users: {},
    words: [],
    stamp: 0,
    timer: false,
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
      state.timer = true;
    },

    stopTimer(state) {
      state.timer = false;
    },

    game(state, game) {
      Object.assign(state, game);

      let keys = Object.keys(state.users || {});
      keys.sort();
      state.pos = (keys.indexOf(state.uid) + state.round * 2) % keys.length;
      state.nextPos = (keys.indexOf(state.uid) + state.round * 2 + 1) % keys.length;

      if (state.results) {
        let res = state.results[state.pos];
        let nextRes = state.results[state.nextPos];

        if (res) state.word = state.round === 0 ? res.word : res[`guess-${state.round}`];
        if (nextRes) state.drawing = nextRes[`draw-${state.round}`];
      }

      state.isOwner = state.owner === state.uid;
      state.isDone = state.round > 0 && Math.floor(Object.keys(state.users || {}).length / 2) === state.round + 1;
    }
  },

  actions: {
    auth({
      commit,
      dispatch
    }) {
      auth.onAuthStateChanged(user => {
        if (!user) {
          auth.signInAnonymously();
        }
        else {
          commit('authenticated', user.uid);
          once(`users/${user.uid}`).then(nick => commit('nick', nick));
        }
      });
    },

    nick({
      state
    }) {
      db.ref(`users/${state.uid}`).set(state.nick);
    },

    createGame({
      state
    }, category) {
      return fetchPin().then(res => {
        const ref = db.ref('game').push({
          category,
          pin: res.pin,
          owner: state.uid
        });
        return res.ref.update({
          game: ref.key
        }).then(() => ref.key);
      });
    },

    startGame({
      state
    }) {
      let round = state.round;
      let done = state.done;
      round++;
      if (state.isDone || state.round === null || isNaN(round) || done === true) {
        round = 0;
        db.ref(`game/${state.key}/results`).set(null);
      }
      db.ref(`game/${state.key}`).update({
        round,
        ping: TIMESTAMP
      });
    },

    fetchWords({
      state,
      commit
    }, count) {
      return once(`words/${state.category}`)
        .then(res => Object.values(res))
        .then(words => Array.from(Array(count).keys()).map(() => words.splice(Math.random() * words.length, 1)[0]))
        .then(words => commit('words', words));
    },

    pickWord({
      state
    }, word) {
      db.ref(`game/${state.key}/results/${state.pos}`)
        .set({
          word,
          owner: state.uid
        });
    },

    guess({
      state
    }, guess) {
      if (!guess) return;
      const path = `game/${state.key}/results/${state.nextPos}/guess-${state.round + 1}`;
      db.ref(path).set(guess);
      db.ref(`${path}-by`).set(state.uid);
    },

    setDrawing({
      state
    }, data) {
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

    setScore({
      state
    }, data) {
      const items = state.results[data.pos];
      const drawnBy = items[`draw-${data.index}-by`];
      const guessedBy = items[`guess-${data.index + 1}-by`];
      const correct = !items[`correct-${data.index}`];
      [drawnBy, guessedBy].forEach(uid =>
        db.ref(`game/${state.key}/score/${uid}`).set(
          ((state.score || {})[uid] || 0) + (correct ? 1 : -1)
        ));
      db.ref(`game/${state.key}/results/${data.pos}/correct-${data.index}`).set(correct);
    },

    round({
      state,
      commit
    }) {
      let diff = Date.now() - state.ping + state.stamp;
      let pick = 0;
      if (state.round === 0) pick = pickTime;
      let maxTime = pick + drawTime + guessTime;
      if (state.timer || isNaN(diff) || diff >= maxTime) return;

      const timer = (cb, interval) => {
        interval -= diff;
        if (interval <= 0) {
          cb();
          return;
        }
        setTimeout(cb, interval);
      };

      commit('startTimer');
      timer(() => commit('go', 'pick'), 0);
      timer(() => commit('go', 'draw'), pick);
      timer(() => commit('go', 'guess'), pick + drawTime);
      timer(() => {
        commit('go', 'game-lobby');
        commit('stopTimer');
      }, maxTime);
    },

    joinGame({
      dispatch,
      commit,
      state
    }, key) {
      commit('joinGame', key);

      db.ref(`game/${state.key}/users/${state.uid}`).set(state.nick);
      stamp().then(stamp => commit('stamp', stamp));

      on(`game/${key}`, game => {
        commit('game', game);
        dispatch('round');
      });
    }
  }
});

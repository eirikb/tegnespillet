import Vue from 'vue';
import Vuex from 'vuex';
import { update, db, auth, on, once, stamp, storage, TIMESTAMP, fetchPin } from './fb';
import toBlob from 'canvas-to-blob';
import { results, guess, draw, pick, gameLobby } from './demo';
import { range, first } from 'lodash';

const pickTime = 5000;
const drawTime = 10000;
const guessTime = 10000;

Vue.use(Vuex);

export default new Vuex.Store({

  // state: draw,

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
    rounds: [],
    nextPos: 0,
    users: {},
    words: [],
    stamp: 0,
    timer: false,
    interval: 0,
    end: 0
  },

  mutations: {
    authenticated(state, uid) {
      state.uid = uid;
    },

    nick(state, nick) {
      state.name = 'lobby';
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

    startTimer(state, data) {
      console.log('startTimer', data);
      state.timer = true;
      state.name = data.name;
      state.interval = data.interval;
      state.round = data.round;
      state.end = data.time;
    },

    stopTimer(state) {
      console.log('stopTimer');
      state.timer = false;
      state.round = null;
    },

    round(state, round) {
      state.round = round;
    },

    game(state, game) {
      Object.assign(state, game);

      let keys = Object.keys(state.users || {});
      keys.sort();
      state.pos = (keys.indexOf(state.uid) + state.round * 2) % keys.length;
      state.nextPos = (keys.indexOf(state.uid) + state.round * 2 + 1) % keys.length;

      // if (state.results) {
      //   let res = state.results[state.pos];
      //   let nextRes = state.results[state.nextPos];

      //   if (res) state.word = state.round === 0 ? res.word : res[`guess-${state.round}`];
      //   if (nextRes) state.drawing = nextRes[`draw-${state.round}`];
      // }

      // state.isDone = state.round > 0 && Math.floor(Object.keys(state.users || {}).length / 2) === state.round + 1;
      if (state.rounds.length > 0) return;

      state.isOwner = state.owner === state.uid;
      state.endRound = Math.floor(Object.keys(state.users || {}).length / 2);

      let end = pickTime;
      state.rounds = [{ time: pickTime, name: 'pick', end }];
      range(0, state.endRound).forEach(round => {
        end += drawTime;
        state.rounds.push({ time: drawTime, name: 'draw', end, round });
        end += guessTime;
        state.rounds.push({ time: guessTime, name: 'guess', end, round });
      });
    }
  },

  actions: {
    auth({ commit, dispatch }) {
      auth.onAuthStateChanged(user => {
        if (!user) {
          auth.signInAnonymously();
        } else {
          commit('authenticated', user.uid);
          Promise.all([
            stamp(),
            once(`users/${user.uid}`)
          ]).then(res => {
            commit('stamp', res[0]);
            commit('nick', res[1]);
          });
        }
      });
    },

    nick({ state }) {
      db.ref(`users/${state.uid}`).set(state.nick);
    },

    createGame({ state }, category) {
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

    startGame({ state, commit }) {
      update(`game/${state.key}`, {
        results: null,
        ping: TIMESTAMP
      });
    },

    fetchWords({ state, commit }, count) {
      return once(`words/${state.category}`)
        .then(res => Object.values(res))
        .then(words => Array.from(Array(count).keys()).map(() => words.splice(Math.random() * words.length, 1)[0]))
        .then(words => commit('words', words));
    },

    pickWord({ state }, word) {
      db.ref(`game/${state.key}/results/${state.pos}`)
        .set({
          word,
          owner: state.uid
        });
    },

    guess({ state }, guess) {
      if (!guess) return;
      const path = `game/${state.key}/results/${state.nextPos}/guess-${state.round + 1}`;
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

    setScore({ state }, data) {
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

    round({ state, commit, dispatch }) {
      let diff = Date.now() - state.ping + state.stamp;
      if (isNaN(diff) || state.timer) return;
      console.log('diff', diff, state.ping, state.ping, state.stamp);

      const round = first(state.rounds.filter(time => diff <= time.end));
      console.log('round', round);
      if (round) {
        const interval = round.end - diff;
        commit('startTimer', Object.assign({ interval }, round));
        setTimeout(() => {
          commit('stopTimer');
          dispatch('round');
        }, interval);
      } else {
        commit('go', 'game-lobby');
      }
    },

    joinGame({ dispatch, commit, state }, key) {
      commit('joinGame', key);

      db.ref(`game/${state.key}/users/${state.uid}`).set(state.nick);

      on(`game/${key}`, game => {
        console.log('onGame');
        commit('game', game);
        dispatch('round');
      });
    }
  }
});

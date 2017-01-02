import Vue from 'vue';
import Vuex from 'vuex';
import { update, db, auth, on, once, stamp, storage, TIMESTAMP, fetchPin } from './fb';
import toBlob from 'canvas-to-blob';
import { range, first } from 'lodash';
import { pick } from './demo';

const pickTime = 5000;
const drawTime = 30000;
const guessTime = 30000;

Vue.use(Vuex);

export default new Vuex.Store({

  // state: pick,

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
    end: 0,
    keys: [],
    results: []
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

    round(state, round) {
      state.round = round || state.round || 0;

      state.pos = (state.keys.indexOf(state.uid) + state.round * 2) % state.keys.length;
      state.nextPos = (state.keys.indexOf(state.uid) + state.round * 2 + 1) % state.keys.length;
      state.isDone = state.round === state.endRound;

      if (state.results) {
        let res = state.results[state.pos];
        let nextRes = state.results[state.nextPos];

        if (res) state.word = state.round === 0 ? res.word : res[`guess-${state.round}`];
        if (nextRes) state.drawing = nextRes[`draw-${state.round}`];
      }
    },

    startTimer(state, data) {
      state.timer = true;
      state.name = data.name;
      state.interval = data.interval;
      state.end = data.time;
    },

    stopTimer(state) {
      state.timer = false;
      state.round = null;
    },

    game(state, game) {
      Object.assign(state, game);

      state.isOwner = state.owner === state.uid;

      state.keys = Object.keys(state.users || {});
      state.keys.sort();
      state.endRound = Math.floor(state.keys.length / 2);
    },

    ping(state, ping) {
      state.ping = ping;
      let end = pickTime;
      state.rounds = [{
        id: 0,
        time: pickTime,
        name: 'pick',
        end
      }];
      range(0, state.endRound).forEach((round, id) => {
        end += drawTime;
        state.rounds.push({
          id,
          time: drawTime,
          name: 'draw',
          end,
          round
        });
        end += guessTime;
        state.rounds.push({
          id,
          time: guessTime,
          name: 'guess',
          end,
          round
        });
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
      commit('words', []);
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

    guess({ state }, data) {
      if (!data.guess) return;
      const path = `game/${state.key}/results/${data.nextPos}/guess-${data.round + 1}`;
      db.ref(path).set(data.guess);
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

      state.rounds.forEach(round => round.active = false);
      const round = first(state.rounds.filter(time => diff <= time.end));
      if (round) {
        commit('round', round.id);
        round.active = true;
        const interval = round.end - diff;
        commit('startTimer', Object.assign({
          interval
        }, round));
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

      on(`game/${key}/ping`, ping => {
        commit('ping', ping);
        dispatch('round');
      });

      on(`game/${key}`, game => {
        commit('game', game);
        commit('round');
      });
    }
  }
});

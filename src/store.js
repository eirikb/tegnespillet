import Vue from 'vue';
import Vuex from 'vuex';
import {db, auth, on, once, stamp, storage, TIMESTAMP} from './fb';
import toBlob from 'canvas-to-blob';

const isDone = state =>
state.round > 0 && Math.floor(Object.keys(state.users || {}).length / 2) === state.round + 1;

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
    pin: null,
    nick: '',
    users: [],
    words: []
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

    pin(state, pin) {
      state.pin = pin;
    },

    users(state, users) {
      state.users = users;
      state.done = isDone(state);
    },

    owner(state, owner) {
      state.owner = owner;
    },

    stamp(state, stamp) {
      state.stamp = stamp;
    },

    round(state, data) {
      state.round = data.round;
      state.ping = data.ping;
      state.done = isDone(state);
    },

    pick(state) {
      state.name = 'pick';
    },

    draw(state) {
      state.name = 'draw';
    },

    guess(state) {
      state.name = 'guess';
    },

    lobby(state) {
      state.name = 'game-lobby';
    },

    results(state, results) {
      state.done = isDone(state);
      Object.assign(state, results);
    },

    roundName(state, data) {
      state.done = isDone(state);
      state.round = data.round;
      state.name = data.name;
    },

    words(state, words) {
      state.words = words;
    }
  },

  actions: {
    auth({commit, dispatch}) {
      auth.onAuthStateChanged(user => {
        if (!user) {
          auth.signInAnonymously();
        } else {
          commit('authenticated', user.uid);
          once(`users/${user.uid}/nick`).then(nick => commit('nick', nick));
        }
      });
    },

    nick({state}) {
      db.ref(`users/${state.uid}`).update({nick: state.nick});
    },

    createGame({state}) {
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

    startGame({state}) {
      let round = state.round;
      let done = state.done;
      round++;
      if (isNaN(round) || done === true) round = 0;
      db.ref(`game/${state.key}/round`).set({round, ping: TIMESTAMP});
    },

    fetchWords({commit}, count) {
      return once('words/norsk')
        .then(res => Object.values(res))
        .then(words => Array.from(Array(count).keys()).map(() => words.splice(Math.random() * words.length, 1)[0]))
        .then(words => commit('words', words));
    },

    word({state}, data) {
      db.ref(`game/${state.key}/results/${data.pos}`)
        .set({word: data.word, owner: state.uid});
    },

    setGuess({state}, data) {
      if (!data.path) return;
      db.ref(data.path).set(data.guess);
      db.ref(`${data.path}-by`).set(state.uid);
    },

    setDrawing({state}, data) {
      let blob = toBlob(data.data);
      storage.ref().child(`${data.path}.jpg`).put(blob)
        .then(res => res.downloadURL)
        .then(drawing => {
          db.ref(data.jpath).set(drawing);
          db.ref(`${data.path}-by`).set(state.uid);
        });
    },

    getGameByPin({}, pin) {
      return once(`pin/${pin}`).then(res => (res || {}).game);
    },

    joinGame({commit, state}, key) {
      const pickTime = 5000;
      const drawTime = 30000;
      const guessTime = 30000;
      let t1;

      const onRound = () => {
        let diff = Date.now() - state.ping + state.stamp;
        if (t1) {
          clearTimeout(t1);
        }
        let timeout;
        let pick = 0;
        if (state.round === 0) {
          pick = pickTime;
        }

        if (state.round === 0 && diff < pick) {
          commit('pick');
          timeout = pick - diff;
        } else if (diff < pick + drawTime) {
          commit('draw');
          timeout = pick + drawTime - diff;
        } else if (diff < pick + drawTime + guessTime) {
          commit('guess');
          timeout = pick + drawTime + guessTime - diff;
        } else {
          commit('lobby');
        }

        if (timeout) {
          t1 = setTimeout(() => {
            onRound();
          }, timeout + 500);
        }
      };

      commit('joinGame', key);
      db.ref(`game/${state.key}/users/${state.uid}`).set(true);

      once(`game/${state.key}/pin`).then(pin => commit('pin', pin));
      once(`game/${state.key}/owner`).then(owner => commit('owner', owner === state.uid));
      stamp().then(stamp => commit('stamp', stamp));

      let userRefs = [];
      const users = {};
      on(`game/${state.key}/users`, us => {
        if (!us) return;
        userRefs.forEach(u => u.off('value'));
        userRefs = Object.keys(us).map(uid => {
          let ref = db.ref(`users/${uid}`);
          ref.on('value', uu => {
            let user = uu.val();
            if (!user) return;
            users[uid] = {uid, nick: user.nick};
            commit('users', Object.values(users));
          });
          return ref;
        });
      });

      on(`game/${state.key}/results`, results => commit('results', results));

      on(`game/${state.key}/round`, round => {
        if (!round) {
          commit('round', {round: -1});
          return;
        }
        if (round.name) {
          commit('roundName', {round: round.round, name: round.name});
          return;
        }
        commit('round', {round: round.round, ping: round.ping});
        onRound();
      });
    }
  }
});

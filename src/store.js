import Vue from 'vue';
import Vuex from 'vuex';
import fb from './fb';

const isDone = state =>
  state.round > 0 && Math.floor(Object.keys(state.users || {}).length / 2) === state.round + 1;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: 'auth',
    key: null,
    uid: null,
    pin: null
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

    user(state, data) {
      const users = state.users || {};
      users[data.uid] = data.nick;
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
    }
  },

  actions: {
    auth({ dispatch }) {
      fb.auth.onAuthStateChanged(user => {
        if (!user) {
          fb.auth.signInAnonymously();
          dispatch('authenticated', user.uid);
        } else {
          fb.once(`users/${user.uid}/nick`).then(nick => dispatch('nick', nick));
        }
      });
    },

    joinGame({ dispatch, commit, state }) {
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

      commit('joinGame', state.key);
      fb.db.ref(`game/${state.key}/users/${state.uid}`).set(true);

      fb.once(`game/${state.key}/pin`).then(pin => commit('pin', pin));
      fb.once(`game/${state.key}/owner`).then(owner => commit('owner', owner === state.uid));
      fb.stamp().then(stamp => commit('stamp', stamp));


      let users = [];
      fb.on(`game/${state.key}/users`, us => {
        if (!us) return;
        users.forEach(u => u.off('value'));
        users = Object.keys(us).map(uid => {
          let ref = fb.db.ref(`users/${uid}`);
          ref.on('value', uu => {
            let user = uu.val();
            if (!user) return;
            commit('user', { uid, nick: user.nick });
          });
          return ref;
        });
      });

      fb.on(`game/${state.key}/hack`, hack => commit('hack', hack));

      fb.on(`game/${state.key}/results`, results => commit('results', results));

      fb.on(`game/${state.key}/round`, round => {
        if (!round) {
          commit('round', -1);
          return;
        }
        if (round.name) {
          commit('roundName', { round: round.round, name: round.name });
          return;
        }
        commit('round', { round: round.round, ping: round.ping });
        onRound();
      });
    }
  }
});

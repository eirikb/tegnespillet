const isDone = state =>
  state.round > 0 && Math.floor(Object.keys(state.users || {}).length / 2) === state.round + 1;

const lobby = (state = {
  name: ''
}, action) => {
  switch (action.type) {
    case 'AUTHENTICATED':
      return Object.assign({}, state, { name: 'lobby', uid: action.uid });

    case 'NICK':
      return Object.assign({}, state, { nick: action.nick });

    case 'JOIN_GAME':
      return Object.assign({}, state, { name: 'game-lobby', key: action.key });

    case 'PIN':
      return Object.assign({}, state, { pin: action.pin });

    case 'USER':
      let users = state.users || {};
      users[action.uid] = action.nick;
      return Object.assign({}, state, { users, done: isDone(state) });

    case 'OWNER':
      return Object.assign({}, state, { owner: action.owner });

    case 'STAMP':
      return Object.assign({}, state, { stamp: action.stamp });

    case 'ROUND':
      return Object.assign({}, state, { round: action.round, ping: action.ping, done: isDone(state) });

    case 'PICK':
      return Object.assign({}, state, { name: 'pick' });

    case 'DRAW':
      return Object.assign({}, state, { name: 'draw' });

    case 'GUESS':
      return Object.assign({}, state, { name: 'guess' });

    case 'LOBBY':
      return Object.assign({}, state, { name: 'game-lobby' });

    case 'RESULTS':
      return Object.assign({}, state, Object.assign({ done: isDone(state) }, action.results));

      // TODO:
    case 'HACK':
      if (!action.hack) return state;
      return Object.assign({}, state, { name: action.hack });

    default:
      return state;
  }
};

export default lobby;

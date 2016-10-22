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
      return Object.assign({}, state, { users });

    case 'OWNER':
      return Object.assign({}, state, { owner: action.owner });

    case 'STAMP':
      return Object.assign({}, state, { stamp: action.stamp });

    case 'ROUND':
      return Object.assign({}, state, { round: action.id, ping: action.ping });

    case 'PICK':
      return Object.assign({}, state, { name: 'pick' });

    case 'DRAW':
      return Object.assign({}, state, { name: 'draw' });

    case 'GUESS':
      return Object.assign({}, state, { name: 'guess' });

    case 'LOBBY':
      return Object.assign({}, state, { name: 'game-lobby' });

    case 'ROUNDS':
      return Object.assign({}, state, { rounds: action.rounds });

    case 'TARGET':
      return Object.assign({}, state, { target: action.target });

    default:
      return state;
  }
};

export default lobby;
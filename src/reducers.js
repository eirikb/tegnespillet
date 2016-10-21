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

    default:
      return state;
  }
};

export default lobby;
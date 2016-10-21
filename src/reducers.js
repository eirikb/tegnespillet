const lobby = (state = {
  name: 'lobby'
}, action) => {
  switch (action.type) {
    case 'AUTHENTICATED':
      return Object.assign({}, state, { uid: action.uid });
    default:
      return state;
  }
};

export default lobby;
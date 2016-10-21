import fb from './fb';

export const auth = () => {
  return dispatch => {
    fb.auth.onAuthStateChanged(user => {
      if (!user) {
        fb.auth.signInAnonymously();
      } else {
        dispatch({
          type: 'AUTHENTICATED',
          uid: user.uid
        });
        fb.once(`users/${user.uid}/nick`).then(n => dispatch({
          type: 'NICK',
          nick: n
        }));
      }
    });
  };
};
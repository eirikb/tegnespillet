export const getPos = (users, uid, pad = 0) => {
  let keys = Object.keys(users || {});
  keys.sort();
  return (keys.indexOf(uid) + pad) % keys.length;
};

export const getTarget = (state, uid = state.uid, round = state.round) => {
  let pos = getPos(state.users, uid, round * 2);
  let nextPos = getPos(state.users, uid, round * 2 + 1);
  if (pos < 0 || nextPos < 0) return {};

  let res = state[pos];
  let nextRes = state[nextPos];
  if (!res || !nextRes) return {};

  return {
    nick: state.users[uid],
    word: round === 0 ? res.word : res[`guess-${round}`],
    drawing: nextRes[`draw-${round}`],
    drawingBy: state.users[nextRes[`draw-${round}-by`]],
    drawPath: `game/${state.key}/results/${pos}/draw-${state.round}`,
    guessPath: `game/${state.key}/results/${nextPos}/guess-${state.round + 1}`
  };
};

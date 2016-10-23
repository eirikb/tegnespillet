<template>
  <div>
    <h1>{{state.pin}}</h1>
    <button @click="start" v-if="state.owner">Start</button>
    <div v-if="results.length === 0">
      <h1 v-if="!isNaN(state.round) && state.round > 0">Round {{state.round + 1}}</h1>
      <hr>
      Users:
      <div v-for="(nick, uid) in state.users">
        {{nick}}
      </div>
    </div>
    
    <div v-for="result in results">
      <div v-if="result.word">
        <hr>
        <h2>Word: {{result.word}} <small>({{result.owner}})</small></h2>
      </div>
      
      <div v-if="result.drawing">
        <h2>{{result.owner}} drew:</h2>
        <img :src="result.drawing">
      </div>
      
      <div v-if="result.guess">
        <h2>{{result.owner}} guessed: {{result.guess}}</h2>
      </div>
    </div>
    
  </div>
</template>

<script>
  import { startGame } from '../actions';

  export default {
    props: ['state'],

    computed: {
      results() {
        let s = this.state;
        let users = Object.keys(s.users || {});
        users.sort();
        if (users.length === 0 || s.round < users.length - 3 || !s.rounds) return [];

        let res = [];
        users.forEach(uid => {
          if (!s.rounds[0][uid]) return;

          res.push({ word: s.rounds[0][uid].word, owner: s.users[uid] });
          res.push({ drawing: s.rounds[0][uid].drawing, owner: s.users[uid] });
          let pos = users.indexOf(uid);
          for (let round = 1; round <= s.round + 1; round++) {
            let p = (pos + round) % users.length;
            let u = users[p];
            let r = s.rounds[round][u];
            if (r) {
              res.push({ guess: r.word, owner: s.users[u] });
              res.push({ drawing: r.drawing, owner: s.users[u] });
            }
          }
        });
        return res;
      }
    },

    methods: {
      start() {
        startGame(this.state.key, this.state.users, this.state.round);
      }
    }
  };
</script>
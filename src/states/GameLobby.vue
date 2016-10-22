<template>
  <div>
    <h1>{{state.pin}}</h1>
    <button @click="start" v-if="state.owner">Start</button>
    <h1 v-if="!isNaN(state.number)">Round {{state.number}}</h1>
    <hr>
    Users:
    <div v-for="(nick, uid) in state.users">
      {{nick}}
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
        if (users.length === 0 || s.round < users.length -2 || !s.rounds) return [];
        
        let res = [];
        users.forEach(uid => {
          // let pos = users.indexOf(uid);
          res.push({word: s.rounds[0][uid].word, owner: s.users[uid]});
          res.push({drawing: s.rounds[0][uid].drawing, owner: s.users[uid]});
          // for (let round = 1; round < users.length; round++) {
          // }
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
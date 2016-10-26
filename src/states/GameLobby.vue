<template>
  <div>
    <h1>{{state.pin}}</h1>
    <button @click="start" v-if="state.owner">Start</button>
    <div v-if="results.length === 0">
      <h1 v-if="!isNaN(state.round) && state.round > 0">Round {{state.round + 1}}</h1>
      <hr/>
      Users:
      <div v-for="(nick, uid) in state.users">
        {{nick}}
      </div>
    </div>
    
    <div v-for="result in results">
      <hr/>
      <h1>{{result.nick}} got the word {{result.word}}</h1>
      <div v-for="result in result.results">
        <h2 v-if="result.guess">{{result.guessBy}} guessed {{result.guess}}</h2>
        <div v-if="result.drawing">
          <h2>{{result.drawingBy}} drew:</h2>
          <img :src="result.drawing"/>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import { startGame } from '../actions';
  import { getPos } from '../utils';

  export default {
    props: ['state'],

    computed: {
      results() {
        if (this.state.done !== true) return [];
        
        let users = this.state.users;
        let keys = Object.keys(users || {});
        
        return Object.keys(users).map(uid => {
          let pos = getPos(users, uid);
          let res = this.state[pos];
          return {
            word: res.word,
            nick: users[res.owner],
            results: Array.from(Array(keys.length-1), (_, round) => {
              return {
                drawing: res[`draw-${round}`],
                drawingBy: users[res[`draw-${round}-by`]],
                guess: res[`guess-${round}`],
                guessBy: users[res[`guess-${round}-by`]]
              };
            })
          };
        });
      }
    },

    methods: {
      start() {
        startGame(this.state.key, this.state.users, this.state.round, this.state.done);
      }
    }
  };
</script>

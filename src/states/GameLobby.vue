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
          <img :src="result.drawing">
        </div>
      </div>
      
      
      <!--<div v-if="result.word">-->
      <!--  <hr/>-->
      <!--  <h2>Word: {{result.word}} <small>({{result.owner}})</small></h2>-->
      <!--</div>-->
      
      <!--<div v-if="result.drawing">-->
      <!--  <h2>{{result.owner}} drew:</h2>-->
      <!--  <img :src="result.drawing">-->
      <!--</div>-->
      
      <!--<div v-if="result.guess">-->
      <!--  <h2>{{result.owner}} guessed: {{result.guess}}</h2>-->
      <!--</div>-->
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
        let users = this.state.users;
        let keys = Object.keys(users || {});
        let length = Object.keys(this.state[0] || {}).length;
        if (keys.length !== (length - 2) / 2) return [];
        
        let wat = Object.keys(users).map(uid => {
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
          // let res = this.state[pos];
          // return {
          //   nick: this.state.users[uid],
          //   word: getTarget(this.state, uid).word,
          //   results: Array.from(Array(10), (_, round) => getTarget(this.state, uid, round))
          // };
        });
        console.log(wat);
        return wat;
        // let s = this.state;
        // let users = Object.keys(s.users || {});
        // users.sort();
        // if (users.length === 0 || s.round < users.length - 3 || !s.rounds) return [];

        // let res = [];
        // users.forEach(uid => {
        //   if (!s.rounds[0][uid]) return;

        //   let rr = Object.keys(s.rounds);
        //   rr.sort();
        //   rr.forEach(round => {
        //     round = parseInt(round, 10);
        //     let pos = users.indexOf(uid);
        //     let p = (pos + round) % users.length;
        //     let p1 = p -2;
        //     if (p1 < 0) p1 = users.length +p1;
        //     // if (p1 === -1) p1 = users.length -1;
        //     // if (p1 === -2) p1 = users.length -2;

        //     let u = users[p];
        //     let u1 = users[p1];
        //     let r = s.rounds[round][u];
        //     let rp = (s.rounds[round-1] || [])[u1];
        //     if (r) {
        //       if (round === 0) {
        //         res.push({ word: r.word, owner: s.users[u] });
        //       } else {
        //         res.push({ guess: (rp || {}).word, owner: s.users[u1] });
        //       }
        //       res.push({ drawing: r.drawing, owner: s.users[u] });
        //     }
        //   });
        // });
        // return res;
      }
    },

    methods: {
      start() {
        startGame(this.state.key, this.state.users, this.state.round);
      }
    }
  };
</script>

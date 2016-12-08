<template>
  <div>
    <h1>{{$store.state.pin}}</h1>
    <button @click="start" v-if="$store.state.isOwner" :disabled="Object.keys($store.state.users).length < 4">Start</button>
    <div v-if="results.length === 0">
      <h1 v-if="!isNaN($store.state.round) && $store.state.round > 0">Round {{$store.state.round + 1}}</h1>
      <hr/>
      Users:
      <div v-for="(nick, uid) in $store.state.users">
        {{nick}}
      </div>
    </div>
    
    
    <div v-if="$store.state.isDone">
    DONE!
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
  export default {
    computed: {
      results() {
        return [];
        // if (this.$store.state.done !== true) return [];

        // let users = this.$store.state.users;
        // let keys = Object.keys(users || {});

        // return Object.keys(users).map(uid => {
        //   let res = this.$store.state[pos];
        //   return {
        //     word: res.word,
        //     nick: users[res.owner],
        //     results: Array.from(Array(keys.length - 1), (_, round) => {
        //       return {
        //         drawing: res[`draw-${round}`],
        //         drawingBy: users[res[`draw-${round}-by`]],
        //         guess: res[`guess-${round}`],
        //         guessBy: users[res[`guess-${round}-by`]]
        //       };
        //     })
        //   };
        // });
      }
    },

    methods: {
      start() {
        this.$store.dispatch('startGame');
      }
    }
  };
</script>

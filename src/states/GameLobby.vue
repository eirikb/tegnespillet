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
  </div>
</template>

<script>
  import { startGame } from '../actions';

  export default {
    props: ['state'],

    methods: {
      start() {
        startGame(this.state.key, this.state.users, this.state.round);
      }
    }
  };
</script>
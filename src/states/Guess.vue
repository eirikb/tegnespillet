<template>
  <div>
    Guess
    <h1>Guess drawing by {{by}}</h1>
    <img v-if="drawing" :src="drawing">
    <form @submit.prevent="doGuess">
      <input v-model="guess" placeholder="Guess">
      <button type="submit">Ok</button>
    </form>
  </div>
</template>

<script>
  import { pick } from '../actions';

  export default {
    props: ['state'],
    data() {
      return {
        guess: null
      };
    },
    computed: {
      drawing() {
        let s = this.state;
        let uid = this.getUid(s);
        return (((s.rounds || [])[s.round] || {})[uid] || {}).drawing;
      },
      by() {
        let s = this.state;
        return (s.users || {})[this.getUid(s)];
      }
    },
    methods: {
      getUid(s) {
        let users = Object.keys(s.users || {});
        let pos = users.indexOf(s.uid);
        pos = (pos + 1) % users.length;
        return users[pos];
      },
      doGuess() {
        let s = this.state;
        let users = Object.keys(s.users);
        let pos = users.indexOf(s.uid);
        pos = (pos + this.state.round) % users.length;
        let uid = users[pos];
        pick(this.state.key, uid, this.state.round + 1, this.guess);
      }
    }
  };
</script>

<style scoped="true">
  img {
    width: 100vw;
    height: 50vh;
  }
</style>
<template>
  <div>
    <h1>Guess drawing by {{by}}</h1>
    <img v-if="drawing" :src="drawing">
    <form @submit.prevent="doGuess">
      <input v-model="guess" placeholder="Guess">
    </form>
  </div>
</template>

<script>
  import { pick, getTarget } from '../actions';

  export default {
    props: ['state'],
    data() {
      return {
        guess: null
      };
    },
    beforeDestroy() {
        let target = getTarget(this.state, 1, 2);
        pick(this.state.key, target.uid, target.round, this.guess);
    },
    computed: {
      drawing() {
        return getTarget(this.state, 0, 1).drawing;
      },
      by() {
        return getTarget(this.state, 0, 1).nick;
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
<template>
  <div>
    <h1>Guess drawing by {{by}}</h1>
    <img v-if="drawing" :src="drawing">
    <div>
      <input v-model="guess" placeholder="Guess">
      <button @click="save">ok</button>
    </div>
  </div>
</template>

<script>
  import { pick, getTargetUser, getTarget } from '../actions';

  export default {
    props: ['state'],
    data() {
      return {
        guess: null
      };
    },
    mounted() {
      this.round = this.state.round;
    },
    beforeDestroy() {
      this.save();
    },
    computed: {
      drawing() {
        return getTarget(this.state, 0, 1).drawing;
      },
      by() {
        return getTargetUser(this.state, 1).nick;
      }
    },
    methods: {
      save() {
        let target = getTargetUser(this.state, 2);
        pick(this.state.key, target.uid, this.round + 1, this.guess);
      }
    }
  };
</script>

<style scoped="true">
  img {
    width: 75vw;
  }
</style>
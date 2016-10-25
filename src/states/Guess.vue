<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2>Guess drawing by {{by}}</h2>
    <img v-if="drawing" :src="drawing">
    <div>
      <form @submit.prevent="save">
        <input v-model="guess" placeholder="Guess">
        <button type="submit">ok</button>
      </form>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';
  import { getTarget } from '../utils';
  import { setGuess } from '../actions';

  export default {
    components: { ProgressBar },
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
        return getTarget(this.state).drawing;
      },
      by() {
        return getTarget(this.state).drawingBy;
      }
    },
    methods: {
      save() {
        let guessPath = getTarget(this.state).guessPath;
        setGuess(guessPath, this.state.uid, this.guess);
      }
    }
  };
</script>
<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2 v-if="ready">Guess drawing by {{by}}</h2>
    <img v-show="drawing" :src="drawing" ref="image" />
    <div v-if="ready">
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
        ready: false,
        guess: null
      };
    },
    mounted() {
      this.round = this.state.round;
      console.log(this.$refs);
      this.$refs.image.onload = () => this.ready = true;
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

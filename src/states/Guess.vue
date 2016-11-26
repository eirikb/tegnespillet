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

  export default {
    components: { ProgressBar },

    data() {
      return {
        ready: false,
        guess: null
      };
    },

    mounted() {
      this.round = this.$store.state.round;
      this.$refs.image.onload = () => this.ready = true;
    },

    beforeDestroy() {
      this.save();
    },

    computed: {
      drawing() {
        return getTarget(this.$store.state).drawing;
      },
      by() {
        return getTarget(this.$store.state).drawingBy;
      }
    },

    methods: {
      save() {
        let path = getTarget(this.$store.state).guessPath;
        this.$store.dispatch('guess', { path, guess: this.guess });
      }
    }
  };
</script>

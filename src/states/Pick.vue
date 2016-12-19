<template>
  <div>
    <ProgressBar :timeout="5"></ProgressBar>
    Velg ord:
    <div v-for="w in $store.state.words">
      <label>
        <input type="radio" name="w" v-bind:value="w" v-model="word">
        {{w}}
      </label>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';

  export default {
    components: {
      ProgressBar
    },

    data() {
      return {
        word: ''
      };
    },

    created() {
      this.$store.dispatch('fetchWords', 2).then(() =>
        this.word = this.$store.state.words[0]);
    },

    watch: {
      word(word) {
        this.$store.dispatch('pickWord', word);
      }
    }
  };
</script>

<template>
  <div>
    <ProgressBar :timeout="5"></ProgressBar>
    Pick word:
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
  import { getPos } from '../utils';

  export default {
    components: { ProgressBar },

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
        let s = this.$store.state;
        let pos = getPos(s.users, s.uid);
        this.$store.dispatch('word', { pos, word });
      }
    }
  };
</script>

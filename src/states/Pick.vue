<template>
  <div>
    <ProgressBar :timeout="5"></ProgressBar>
    Pick word:
    <div v-for="w in words">
      <label>
        <input type="radio" name="w" v-bind:value="w" v-model="word">
        {{w}}
      </label>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';
  import { getWords, pick } from '../actions';

  export default {
    components: { ProgressBar },
    props: ['state'],
    data() {
      return {
        word: null,
        words: []
      };
    },
    watch: {
      word(w) {
        pick(this.state.key, this.state.uid, this.state.round, w);
      }
    },
    created() {
      getWords(2).then(words => {
        this.words = words;
        this.word = words[0];
      });
    }
  };
</script>
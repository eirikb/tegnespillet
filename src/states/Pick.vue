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
  // import { fetchWords, setWord } from '../actions';
  import { getPos } from '../utils';

  export default {
    components: { ProgressBar },
    data() {
      return {
        word: null,
        words: []
      };
    },
    watch: {
      word(word) {
        let s = this.$store.state;
        let pos = getPos(s.users, s.uid);
        console.log('set word!');
        // setWord(s.key, s.uid, pos, word);
      }
    },
    created() {
      this.$store.dispatch('fetchWords', 2);
    }
  };
</script>

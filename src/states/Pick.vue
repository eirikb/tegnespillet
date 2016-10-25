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
  import { fetchWords, setWord } from '../actions';
  import { getPos } from '../utils';

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
      word(word) {
        let s = this.state;
        let pos = getPos(s.users, s.uid);
        setWord(s.key, s.uid, pos, word);
      }
    },
    created() {
      fetchWords(2).then(words => {
        this.words = words;
        this.word = words[0];
      });
    }
  };
</script>
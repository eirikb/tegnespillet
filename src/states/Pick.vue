<template>
  <div>
    <h2>Velg ord:</h2>
    <div class="blocked" v-for="w in $store.state.words">
      <span class="check">
        <img v-if="isActive(w)" src="node_modules/evil-icons/assets/icons/ei-check.svg"> 
      </span>
      <button :class="{active: isActive(w)}" @click="word = w">
        {{w}}
      </button>
    </div>
  </div>
</template>

<style>
  .active {
    background-color: #4caf50;
  }
  
  .check,
  .check>img {
    display: inline-block;
    width: 32px;
    height: 32px;
  }
</style>

<script>
  export default {
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
    },

    methods: {
      isActive(w) {
        return w === this.word;
      }
    }
  };
</script>

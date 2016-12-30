<template>
  <div>
    <h2>Gjett tegning</h2>
    <img v-if="$store.state.drawing" :src="$store.state.drawing" ref="image" />
    <form @submit.prevent="save">
      <input v-model="guess" placeholder="Gjett tegning">
    </form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        guess: null
      };
    },

    mounted() {
      this.round = this.$store.state.round;
      this.nextPos = this.$store.state.nextPos;
    },

    beforeDestroy() {
      this.save();
    },

    methods: {
      save() {
        this.$store.dispatch('guess', {
          round: this.round,
          nextPos: this.nextPos,
          guess: this.guess
        });
      }
    }
  };
</script>

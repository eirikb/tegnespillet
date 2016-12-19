<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2>Gjett tegning</h2>
    <img v-if="$store.state.drawing" :src="$store.state.drawing" ref="image" />
    <form @submit.prevent="save">
      <input v-model="guess" placeholder="Gjett tegning">
    </form>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';

  export default {
    components: { ProgressBar },

    data() {
      return {
        guess: null
      };
    },

    mounted() {
      this.round = this.$store.state.round;
    },

    beforeDestroy() {
      this.save();
    },

    methods: {
      save() {
        this.$store.dispatch('guess', this.guess);
      }
    }
  };
</script>

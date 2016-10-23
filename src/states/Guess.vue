<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2>Guess drawing by {{by}}</h2>
    <img v-if="drawing" :src="drawing">
    <div>
      <form @submit.prevent="save">
        <input v-model="guess" placeholder="Guess">
        <button type="submit">ok</button>
      </form>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';
  import { pick, getTargetUser, getTarget } from '../actions';

  export default {
    components: { ProgressBar },
    props: ['state'],
    data() {
      return {
        guess: null
      };
    },
    mounted() {
      this.round = this.state.round;
    },
    beforeDestroy() {
      this.save();
    },
    computed: {
      drawing() {
        return getTarget(this.state, 0, 1).drawing;
      },
      by() {
        return getTargetUser(this.state, 1).nick;
      }
    },
    methods: {
      save() {
        let target = getTargetUser(this.state, 2);
        pick(this.state.key, target.uid, this.round + 1, this.guess);
      }
    }
  };
</script>
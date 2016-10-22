<template>
  <div class="full">
      <a id="home" href="/">Home</a>
      <button @click="clean">Clean bean</button>
      <component :is="state.name" :store="store" :state="state"></component>
  </div>
</template>

<script>
  import states from './states';

  import { auth } from './actions';

  //TODO:
  import fb from './fb';
  
  export default {
    components: Object.assign({}, states),
    props: ['store'],
    data() {
      return {
        state: this.store.getState()
      };
    },
    created() {
      this.store.subscribe(() => this.state = this.store.getState());
      this.store.dispatch(auth());
    },
    //TODO:
    methods:{
      clean() {
        fb.db.ref(`game/${this.state.key}`).update({
          round: null,
          rounds: null
        });
      }
    }
  };
</script>

<style lang="sass">
  html,
  body {
    margin: 0;
  }
</style>
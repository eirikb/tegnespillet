<template>
  <div class="full">
      <a id="home" href="/">Home</a>
      <component :is="state.name" :store="store" :state="state"></component>
  </div>
</template>

<script>
  import states from './states';

  import { auth } from './actions';

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
    }
  };
</script>

<style lang="sass">
  html,
  body {
    margin: 0;
  }
</style>
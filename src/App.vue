<template>
  <div class="full">
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
  
  .bottom {
    position: fixed;
    bottom: 20px;
    left: 20px;
  }
  
  img {
    width: 75vw;
  }
  
  .progress {
    height: 5px;
    width: 100%;
    background-color: #3498db;
  }
</style>

<template>
  <div>
          <a id="home" href="/">Home</a>
          <component :is="state.name" :store="store" :state="state"></component>
  </div>
</template>

<script>
    import states from './states';
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
        }
    };
</script>

<style lang="sass">
    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
    }
</style>
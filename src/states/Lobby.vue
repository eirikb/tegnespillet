<template>
  <div>
  <div>
      <input v-model="$store.state.nick" placeholder="Nick" required>
    </div>
    <div>
      <form @submit.prevent="joinGame">
        <input type="number" v-model="pin" placeholder="Join game (PIN)" required>
        <button type="submit">Ok</button>
        {{info}}
      </form>
    </div>
    <div>
      <button @click="create">Create</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: '',
        pin: ''
      };
    },

    created() {
      this.$store.dispatch('auth');
    },

    // TODO:
    watch: {
      'state.nick' () {
        // this.store.dispatch(joinGame(this.state.uid, '-KV6K5iP_k-fLBpP9PYV'));
      }
    },

    methods: {
      create() {
        this.$store.dispatch('nick');
        this.$store.dispatch('createGame').then(key =>
          this.$store.dispatch('joinGame', key));
      },
      joinGame() {
        this.info = 'Looking up game...';
        this.$store.dispatch('nick');
        this.$store.dispatch('getGameByPin', this.pin).then(key => {
          if (!key) {
            this.info = 'Game not found';
            return;
          }
          this.$store.dispatch('joinGame', key);
        });
      }
    }
  };
</script>

<template>
  <div>
  <div>
      <mdl-textfield v-model="$store.state.nick" label="Nick" required></mdl-textfield>
    </div>
    <div>
      <form @submit.prevent="joinGame">
        <mdl-textfield type="number" v-model="pin" label="Join game (PIN)" required></mdl-textfield>
        <mdl-button type="submit">Ok</mdl-button>
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

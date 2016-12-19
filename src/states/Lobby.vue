<template>
  <div>
    <div>
      <input v-model="$store.state.nick" placeholder="Kallenavn" required>
    </div>
    <div>
      <form @submit.prevent="joinGame">
        <input type="number" v-model="pin" placeholder="Bli med i spill (PIN)" required>
        <button type="submit">Ok</button>
        {{info}}
      </form>
    </div>
    <div>
      <hr/>
      <select v-model="category">
        <option value="norsk">Norsk</option>
        <option value="engelsk">Engelsk</option>
        <option value="voksne">For voksne</option>
      </select>
      <button @click="create">Opprett</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: '',
        pin: '',
        category: 'norsk'
      };
    },

    created() {
      this.$store.dispatch('auth');
    },

    // TODO:
    watch: {
      '$store.state.nick' () {
        // this.$store.dispatch('joinGame', '-KYUjwWpp4cWo2bt6Aa4');
      }
    },

    methods: {
      create() {
        this.$store.dispatch('nick');
        this.$store.dispatch('createGame', this.category).then(key =>
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

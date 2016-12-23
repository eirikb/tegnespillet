<template>
  <div>
    <div>
      <input v-model="$store.state.nick" placeholder="Kallenavn">
    </div>
    <div>
      <form @submit.prevent="joinGame">
        <input type="number" v-model="pin" placeholder="PIN" required>
        <button class="blocked" type="submit">Bli med</button>
        {{info}}
      </form>
    </div>
    <div>
      <hr/>
      Opprett spill:
      <button class="blocked" @click="create('norsk')">Norsk</button>
      <button class="blocked" @click="create('engelsk')">Engelsk</button>
      <button class="blocked" @click="create('voksne')">For voksne</button>
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
      '$store.state.nick' () {
        // this.$store.dispatch('joinGame', '-KYUjwWpp4cWo2bt6Aa4');
      }
    },

    methods: {
      create(category) {
        this.$store.dispatch('nick');
        this.$store.dispatch('createGame', category).then(key =>
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

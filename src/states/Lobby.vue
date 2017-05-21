<template>
  <div>
    <div v-if="false">
      <button @click="join">Join</button>
      <button @click="clean">Clean</button>
    </div>
    <h1 class="title lobby-header">Tegnespillet</h1>
    <div>
      <input v-model="$store.state.nick" placeholder="Kallenavn">
    </div>
    <div>
      <form @submit.prevent="joinGame">
        <input type="number" v-model="pin" placeholder="PIN" required>
        <button class="blocked" type="submit">Bli med</button>
        {{info}}
      </form>

      <button @click="showCreate = !showCreate" class="blocked">Opprett</button>
      <div v-show="showCreate">
        <button @click="create('norsk')">Norsk</button>
        <button @click="create('engelsk')">Engelsk</button>
        <button @click="create('voksne')">For voksne</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: '',
        showCreate: false,
        pin: ''
      };
    },

    methods: {
      create(category) {
        this.$store.dispatch('nick');
        this.$store.dispatch('createGame', category).then(key =>
          this.$store.dispatch('joinGame', key));
      },
      joinGame() {
        this.info = 'Kobler til spill...';
        this.$store.dispatch('nick');
        this.$store.dispatch('getGameByPin', this.pin).then(key => {
          if (!key) {
            this.info = 'Fant ikke spill';
            return;
          }
          this.$store.dispatch('joinGame', key);
        });
      }
    }
  };
</script>

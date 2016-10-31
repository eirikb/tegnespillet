<template>
  <div>
  <div>
      <input v-model="state.nick" placeholder="Nick" required>
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
  import { setNick, getGameByPin, createGame, joinGame } from '../actions';

  export default {
    props: ['store', 'state'],
    data() {
      return {
        info: '',
        pin: ''
      };
    },

    // TODO:
    watch: {
      'state.nick' () {
        // this.store.dispatch(joinGame(this.state.uid, '-KV6K5iP_k-fLBpP9PYV'));
      }
    },

    methods: {
      create() {
        setNick(this.state.uid, this.state.nick);
        createGame(this.state.uid).then(key => this.store.dispatch(joinGame(this.state.uid, key)));
      },
      joinGame() {
        this.info = 'Looking up game...';
        setNick(this.state.uid, this.state.nick);
        getGameByPin(this.pin).then(res => {
          if (!res) {
            this.info = 'Game not found';
            return;
          }
          this.store.dispatch(joinGame(this.state.uid, res.game));
        });
      }
    }
  };
</script>

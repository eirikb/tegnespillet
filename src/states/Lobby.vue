<template>
  <div>
  <div>
      <input v-model="state.nick" placeholder="Nick">
      <button @click="setNick">Ok</button>
    </div>
    <div>
      <input type="number" v-model="pin" placeholder="Join game (PIN)">
      <button @click="joinGame">Ok</button>
      {{info}}
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
        pin: window.localStorage.pin
      };
    },

    // TODO:
    watch: {
      'state.nick' () {
        this.store.dispatch(joinGame(this.state.uid, '-KUeoeab0oyLFIWeQLEN'));
      }
    },

    methods: {
      create() {
        createGame(this.state.uid).then(key => this.store.dispatch(joinGame(this.state.uid, key)));
      },
      setNick() {
        console.log(this.state.uid, this.state.nick);
        setNick(this.state.uid, this.state.nick);
      },
      joinGame() {
        this.info = 'Looking up game...';
        getGameByPin(this.pin).then(res => {
          if (!res) {
            this.info = 'Game not found';
            return;
          }
          window.localStorage.pin = this.pin;
          this.store.dispatch(joinGame(this.state.uid, res.game));
        });
      }
    }
  };
</script>

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
  import { setNick, getGameByPin, createGame } from '../actions';

  export default {
    props: ['state'],
    data() {
      return {
        info: '',
        pin: window.localStorage.pin
      };
    },
    methods: {
      create() {
        createGame(this.state.uid).then(key => console.log(key));
      },
      setNick() {
        console.log(this.state.uid, this.state.nick);
        setNick(this.state.uid, this.state.nick);
      },
      joinGame() {
        this.info = 'Looking up game...';
        getGameByPin(this.pin).then(game => {
          if (!game) {
            this.info = 'Game not found';
            return;
          }
          localStorage.pin = this.pin;
          console.log('game', game);
        });
      }
    }
  };
</script>

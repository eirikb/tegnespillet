import Vue from 'vue';
import App from './App.vue';
import store from './store';


import { db } from './fb';

db.ref().remove()
  .then(() => {
    const r = db.ref('words/norsk');
    r.push('kake');
    r.push('bake');
    r.push('sukker');
    r.push('lake');
    r.push('make');
    r.push('måke');
    r.push('kråke');
    r.push('båt');
  }).then(() => new Vue({
    el: '#app',
    store,
    render: h => h(App)
  }));

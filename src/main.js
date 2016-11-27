import Vue from 'vue';
import App from './App.vue';
import store from './store';
import 'material-design-lite/material.js';

import Mdl from 'vue-mdl';
Vue.use(Mdl);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});

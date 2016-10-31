// import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';

import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

new Vue({
  el: '#app',
  render: h => h(App, {
    props: {
      store: store
    }
  })
});

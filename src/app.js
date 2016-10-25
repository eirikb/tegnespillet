import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';

// import 'es6-promise';
// import 'whatwg-fetch';

import reducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

const store = createStore(reducer, applyMiddleware(thunkMiddleware,
createLogger({
  stateTransformer: state => JSON.parse(JSON.stringify(state))
})));

new Vue({
  el: '#app',
  render: h => h(App, {
    props: {
      store: store
    }
  })
});
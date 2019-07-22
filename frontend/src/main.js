// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

//Variavel de configuração do firebase
const firebaseConfig = {
    apiKey: "AIzaSyDz7qhC4UGlxY_Oh5LUDUE55uw9B9OzJWs",
    authDomain: "todolist-6dd4d.firebaseapp.com",
    databaseURL: "https://todolist-6dd4d.firebaseio.com",
    projectId: "todolist-6dd4d",
    storageBucket: "",
    messagingSenderId: "235412716098",
    appId: "1:235412716098:web:ffccac85b2c7f90e"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

//Variavel do banco de dados
export const fb = firebase;
    /* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

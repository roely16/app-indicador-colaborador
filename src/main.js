import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

import JsonExcel from "vue-json-excel";
 
Vue.component("downloadExcel", JsonExcel);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

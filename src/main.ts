import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
  watch: {
    $route: {
      handler: (to) => {
        document.title = to.meta.title ?? 'Internet of Plants';
      },
      immediate: true,
    },
  },
}).$mount('#app');

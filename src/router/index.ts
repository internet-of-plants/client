import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import PlantView from '@/views/PlantView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Plants' },
  },
  {
    path: '/plant/:id',
    name: 'PlantView',
    component: PlantView,
    meta: { title: 'Plant' },
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    meta: { title: 'Login' },
  },
  {
    path: '/signup',
    name: 'SignupView',
    component: SignupView,
    meta: { title: 'Signup' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production'
    ? '/monitor/'
    : '/',
  routes,
});

export default router;

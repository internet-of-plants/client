import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PlantListView from '@/views/PlantListView.vue';
import PlantView from '@/views/PlantView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/LoginView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Plants' },
    component: PlantListView,
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'Signup',
    meta: { title: 'Signup' },
    component: SignupView,
  },
  {
    path: '/plant/:id',
    name: 'Plant',
    meta: { title: 'Plant' },
    component: PlantView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

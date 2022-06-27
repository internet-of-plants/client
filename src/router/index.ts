import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import OrganizationsView from '@/views/OrganizationsView.vue';
import CollectionsView from '@/views/CollectionsView.vue';
import DevicesView from '@/views/DevicesView.vue';
import DeviceView from '@/views/DeviceView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    meta: { title: 'Organizations' },
    component: OrganizationsView,
  },
  {
    path: '/organization/:organizationId',
    name: 'OrganizationView',
    meta: { title: 'Collections' },
    component: CollectionsView,
  },
  {
    path: '/organization/:organizationId/collection/:collectionId',
    name: 'CollectionView',
    meta: { title: 'Devices' },
    component: DevicesView,
  },
  {
    path: '/organization/:organizationId/collection/:collectionId/device',
    name: 'DevicesView',
    meta: { title: 'Devices' },
    component: DevicesView,
  },
  {
    path: '/organization/:organizationId/collection/:collectionId/device/:deviceId',
    name: 'DeviceView',
    meta: { title: 'Device' },
    component: DeviceView,
  },
  {
    path: '/login',
    name: 'LoginView',
    meta: { title: 'Login' },
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'SignupView',
    meta: { title: 'Signup' },
    component: SignupView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

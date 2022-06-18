import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import OrganizationsView from '@/views/OrganizationsView.vue';
import CollectionsView from '@/views/CollectionsView.vue';
import DevicesView from '@/views/DevicesView.vue';
import DeviceView from '@/views/DeviceView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import CreateSensorView from '@/views/CreateSensorView.vue';
import CreateCompilerView from '@/views/CreateCompilerView.vue';
import CompilationsView from '@/views/CompilationsView.vue';
import SensorPrototypesView from '@/views/SensorPrototypesView.vue';
import TargetPrototypesView from '@/views/TargetPrototypesView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    meta: { title: 'Organizations' },
    component: OrganizationsView,
  },
  {
    path: '/organization',
    name: 'OrganizationsView',
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
    path: '/organization/:organizationId/collection',
    name: 'CollectionsView',
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
  {
    path: '/target/prototypes',
    name: 'TargetPrototypesView',
    meta: { title: 'Target Prototypes' },
    component: TargetPrototypesView,
  },
  {
    path: '/sensor/prototypes',
    name: 'SensorPrototypesView',
    meta: { title: 'Sensor Prototypes' },
    component: SensorPrototypesView,
  },
  {
    path: '/sensor/create/:id',
    name: 'CreateSensorView',
    meta: { title: 'Create Sensor' },
    component: CreateSensorView,
  },
  {
    path: '/compiler/create',
    name: 'CreateCompilerView',
    meta: { title: 'Create Compiler' },
    component: CreateCompilerView,
  },
  {
    path: '/compilations',
    name: 'CompilationsView',
    meta: { title: 'Compilations' },
    component: CompilationsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

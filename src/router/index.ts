import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import OrganizationView from '@/views/OrganizationView.vue'
import CollectionView from '@/views/CollectionView.vue'
import DeviceView from '@/views/DeviceView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import CompilerView from '@/views/CompilerView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/organization/:organizationId',
    name: 'OrganizationView',
    meta: { title: 'Organization' },
    component: OrganizationView
  },
  {
    path: '/organization/:organizationId/collection/:collectionId',
    name: 'DevicesView',
    meta: { title: 'Devices' },
    component: CollectionView
  },
  {
    path: '/organization/:organizationId/collection/:collectionId/device/:deviceId',
    name: 'DeviceView',
    meta: { title: 'Device' },
    component: DeviceView
  },
  {
    path: '/compiler/:compilerId/code',
    name: 'CompilerView',
    meta: { title: 'Compiler' },
    component: CompilerView
  },
  {
    path: '/',
    name: 'Home',
    meta: { title: 'Login' },
    component: LoginView
  },
  {
    path: '/login',
    name: 'LoginView',
    meta: { title: 'Login' },
    component: LoginView
  },
  {
    path: '/signup',
    name: 'SignupView',
    meta: { title: 'Signup' },
    component: SignupView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

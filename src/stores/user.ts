import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import UserService from '@/api/user'
import type { User } from '@/models'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  async function FETCH_USER() {
    user.value = await UserService.find()
  }

  const isAuthenticated = ref(false);

  return { user, FETCH_USER, isAuthenticated }
})

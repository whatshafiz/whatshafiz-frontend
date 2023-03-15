import { defineStore, getActivePinia } from 'pinia'
import { getProfile } from '@/services/AuthService'
import router from '@/router/index'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: localStorage.getItem('token'),
      profile: {},
      permissions: {},
      roles: {}
    }
  },
  getters: {
  },
  actions: {
    isLoggedIn() {
      if (!localStorage.getItem('token')) {
        return false
      }

      return true
    },
    setProfile(userData) {
      this.token = localStorage.getItem('token')
      this.profile = userData.user
      this.permissions = userData.permissions
      this.roles = userData.roles
    },
    logout() {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    },
  },
})

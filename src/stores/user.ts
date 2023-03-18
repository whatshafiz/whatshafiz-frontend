import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: null,
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
      window.location.href = '/login'
    },
  },
})

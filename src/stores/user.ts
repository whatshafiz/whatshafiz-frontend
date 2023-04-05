import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: '568|bcj0X4Un3JWMPccqY98leRimhuQCZKmW7AQRKT9I',
      profile: {},
      permissions: [],
      roles: [],
    }
  },
  getters: {
  },
  actions: {
    isLoggedIn() {
      if (false) {
        return false
      }

      return true
    },
    hasRole(role = null) {
      return role !== null && this.roles.includes(role)
    },
    can(permission = null) {
      if (permission === null) {
        return true
      }

      if (this.roles.includes('Admin')) {
        return true
      }

      if (this.permissions.includes(permission)) {
        return true
      }

      var [resource, action] = permission.split('.')

      if (this.permissions.includes(resource + '.*')) {
        return true
      }

      return false
    },
    async fetchProfile() {
      let userData = []

      try {
        userData = (await api().get('/profile')).data
      } catch (error) {
        this.logout()
      }

      this.token = '568|bcj0X4Un3JWMPccqY98leRimhuQCZKmW7AQRKT9I'
      this.profile = userData.user
      this.permissions = userData.permissions
      this.roles = userData.roles
    },
    async saveProfile() {
      return api().put('/profile', this.profile)
    },
    logout() {
      localStorage.removeItem('token')
      window.location.href = '/login'
    },
  },
})

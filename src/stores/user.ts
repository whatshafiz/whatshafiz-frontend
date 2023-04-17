import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: null,
      profile: {},
      permissions: [],
      roles: [],
    }
  },
  getters: {
    getIndexURL() {
      return getBaseUrl('/users')
    },
  },
  actions: {
    isLoggedIn() {
      if (!localStorage.getItem('token')) {
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

      this.token = localStorage.getItem('token')
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
    async toggleUserBanStatus(userId, isBanned = true) {
      try {
        await api().post('/users/' + userId + '/ban', { is_banned: isBanned })

        return true
      } catch (response) {
        console.log('banUser error', response)

        return false
      }
    },
    async fetchUser(userId) {
      try {
        return (await api().get('/users/' + userId)).data.user
      } catch (response) {
        console.log('fetchUser error', response)
      }
    },
    async removeRole(userId, roleId) {
      try {
        await api().delete('/users/' + userId + '/roles/' + roleId)

        return true
      } catch (response) {
        console.log('removeRole error', response)

        return false
      }
    },
    async removeCourse(userId, courseId) {
      try {
        await api().delete('/users/' + userId + '/courses/' + courseId)

        return true
      } catch (response) {
        console.log('removeCourse error', response)

        return false
      }
    },
    async removeWhatsappGroup(userId, whatsappGroupId) {
      try {
        await api().delete('/users/' + userId + '/whatsapp-groups/' + whatsappGroupId)

        return true
      } catch (response) {
        console.log('removeWhatsappGroup error', response)

        return false
      }
    },
  },
})

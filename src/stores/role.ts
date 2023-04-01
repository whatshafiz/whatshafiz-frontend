import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useRoleStore = defineStore('role', {
  state: () => {
    return {
      roles: [],
    }
  },
  getters: {
    getRoles(state) {
      return state.roles
    },
    getIndexURL() {
      return getBaseUrl('/roles')
    }
  },
  actions: {
    async fetchRoles() {
      try {
        this.roles = (await api().get('/roles')).data.roles

        return this.roles
      } catch (response) {
        console.log('fetchRoles error', response)
      }
    },
    async fetchRole(roleId) {
      try {
        return (await api().get('/roles/' + roleId)).data.role
      } catch (response) {
        console.log('fetchRoles error', response)
      }
    },
    async storeRole(roleData) {
      try {
        return (await api().post('/roles', roleData)).data
      } catch (response) {
        console.log('createRole error', response)

        throw response
      }
    },
    async updateRole(roleId, roleData) {
      try {
        return (await api().put('/roles/' + roleId, roleData)).data
      } catch (response) {
        console.log('createRole error', response)

        throw response
      }
    },
    async deleteRole(roleId) {
      try {
        await api().delete('/roles/' + roleId)

        return true
      } catch (response) {
        console.log('deleteRoles error', response)

        return false
      }
    },
  },
})

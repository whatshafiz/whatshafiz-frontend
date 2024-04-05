import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useWhatsappGroupStore = defineStore('whatsappGroup', {
  state: () => {
    return {
      whatsappGroups: [],
    }
  },
  getters: {
    getWhatsappGroups(state) {
      return state.whatsappGroups
    },
    getIndexURL() {
      return getBaseUrl('/whatsapp-groups')
    },
    getMyIndexURL() {
      return getBaseUrl('/my/whatsapp-groups')
    },
  },
  actions: {
    getCourseWhatsappGroupsIndexURL(courseId) {
      return getBaseUrl('/whatsapp-groups?course_id=' + courseId)
    },
    async fetchWhatsappGroups(searchFilters = {}) {
      try {
        this.whatsappGroups = (await api().get('/whatsapp-groups', { params: searchFilters })).data.data

        return this.whatsappGroups
      } catch (response) {
        console.log('fetchWhatsappGroups error', response)
      }
    },
    async fetchWhatsappGroup(whatsappGroupId) {
      try {
        return (await api().get('/whatsapp-groups/' + whatsappGroupId)).data.whatsappGroup
      } catch (response) {
        console.log('fetchWhatsappGroup error', response)
      }
    },
    async createWhatsappGroup(whatsappGroupData) {
      try {
        return (await api().post('/whatsapp-groups', whatsappGroupData)).data
      } catch (response) {
        console.log('create whatsappGroup error', response)

        return false
      }
    },
    async updateWhatsappGroup(whatsappGroupId, whatsappGroupData) {
      try {
        return (await api().put('/whatsapp-groups/' + whatsappGroupId, whatsappGroupData)).data
      } catch (response) {
        console.log('update whatsappGroup error', response)

        return false
      }
    },
    async deleteWhatsappGroup(whatsappGroupId) {
      try {
        await api().delete('/whatsapp-groups/' + whatsappGroupId)

        return true
      } catch (response) {
        console.log('deleteWhatsappGroup error', response)

        return false
      }
    },
  },
})

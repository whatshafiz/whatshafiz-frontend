import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useComplaintsStore = defineStore('complaint', {
  state: () => {
    return {
      complaints: [],
    }
  },
  getters: {
    getComplaints(state) {
      return state.complaints
    },
    getIndexURL() {
      return getBaseUrl('/complaints')
    },
    getUnresolvedIndexURL() {
      return getBaseUrl('/complaints?is_resolved=0')
    },
  },
  actions: {
    async fetchComplaints() {
      try {
        this.complaints = (await api().get('/complaints')).data.complaints

        return this.complaints
      } catch (response) {
        console.log('fetchComplaints error', response)
      }
    },
    async fetchComplaint(complaintId) {
      try {
        return (await api().get('/complaints/' + complaintId)).data.complaint
      } catch (response) {
        console.log('fetchComplaint error', response)
      }
    },
    async createComplaint(complaintData) {
      try {
        await api().post('/complaints', complaintData)

        return true
      } catch (response) {
        console.log('create complaint error', response)

        return false
      }
    },
    async updateComplaint(complaintId, complaintData) {
      try {
        await api().put('/complaints/' + complaintId, complaintData)

        return true
      } catch (response) {
        console.log('update complaint error', response)

        return false
      }
    },
    async deleteComplaint(complaintId) {
      try {
        await api().delete('/complaints/' + complaintId)

        return true
      } catch (response) {
        console.log('deleteComplaint error', response)

        return false
      }
    },
  },
})

import api from '@/utils/api'
import { defineStore } from 'pinia'
import { getBaseUrl } from '@/utils/api'

export const useRegulationStore = defineStore('regulation', {
  state: () => {
    return {
      regulations: []
    }
  },
  getters: {
    getRegulations(state) {
      return state.regulations
    },
    getIndexURL() {
      return getBaseUrl('/regulations/paginate')
    },
  },
  actions: {
    async fetchRegulations() {
      try {
        this.regulations = (await api().get('/regulations')).data

        return this.regulations
      } catch (response) {
        console.log('fetchRegulations error', response)
      }
    },
    async fetchRegulation(regulationId) {
      try {
        return (await api().get('/regulations/' + regulationId)).data
      } catch (response) {
        console.log('fetchRegulation error', response)

        return false
      }
    },
    async createRegulation(regulationData) {
      try {
        await api().post('/regulations', regulationData)

        return true
      } catch (response) {
        console.log('create regulation error', response)

        return false
      }
    },
    async updateRegulation(regulationId, regulationData: FormData) {
      try {
        return (await api().put('/regulations/' + regulationId, regulationData)).data
      } catch (response) {
        console.log('update regulation error', response)

        return false
      }
    },
    async deleteRegulation(regulationId) {
      try {
        await api().delete('/regulations/' + regulationId)

        return true
      } catch (response) {
        console.log('deleteRegulation error', response)

        return false
      }
    }
  }
})

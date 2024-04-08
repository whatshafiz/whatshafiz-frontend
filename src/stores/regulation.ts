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
    async fetchRegulation(slug: string) {
      try {
        return (await api().get('/regulations/' + slug)).data
      } catch (response) {
        console.log('fetchRegulation error', response)

        return false
      }
    },
    async updateRegulation(slug: string, regulationData: FormData) {
      try {
        return (await api().post('/regulations/' + slug, regulationData)).data
      } catch (response) {
        console.log('update regulation error', response)

        return false
      }
    }
  }
})

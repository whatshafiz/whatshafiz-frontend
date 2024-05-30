import api from '@/utils/api'
import { defineStore } from 'pinia'

export const useEducationLevelStore = defineStore('educationLevel', {
  state: () => {
    return {
      educationLevels: []
    }
  },
  getters: {
    getEducationLevels(state) {
      return state.educationLevels
    }
  },
  actions: {
    async fetchEducationLevels() {
      try {
        this.educationLevels = (await api().get('/education-levels')).data.educationLevels

        return this.educationLevels
      } catch (response) {
        console.log('fetchEducationLevels error', response)
      }
    }
  }
})

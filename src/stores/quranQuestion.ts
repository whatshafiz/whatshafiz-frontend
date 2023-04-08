import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useQuranQuestionStore = defineStore('quranQuestion', {
  state: () => {
    return {
      quranQuestions: [],
    }
  },
  getters: {
    getQuranQuestions(state) {
      return state.quranQuestions
    },
    getIndexURL() {
      return getBaseUrl('/quran-questions')
    },
  },
  actions: {
    async fetchQuranQuestions() {
      try {
        this.quranQuestions = (await api().get('/quran-questions')).data.quranQuestions

        return this.quranQuestions
      } catch (response) {
        console.log('fetchQuranQuestions error', response)
      }
    },
    async fetchQuranQuestion(quranQuestionId) {
      try {
        return (await api().get('/quran-questions/' + quranQuestionId)).data.quranQuestion
      } catch (response) {
        console.log('fetchQuranQuestion error', response)
      }
    },
    async createQuranQuestion(quranQuestionData) {
      try {
        return (await api().post('/quran-questions', quranQuestionData)).data
      } catch (response) {
        console.log('create quranQuestion error', response)

        return false
      }
    },
    async updateQuranQuestion(quranQuestionId, quranQuestionData) {
      try {
        return (await api().put('/quran-questions/' + quranQuestionId, quranQuestionData)).data
      } catch (response) {
        console.log('update quranQuestion error', response)

        return false
      }
    },
    async deleteQuranQuestion(quranQuestionId) {
      try {
        await api().delete('/quran-questions/' + quranQuestionId)

        return true
      } catch (response) {
        console.log('deleteQuranQuestion error', response)

        return false
      }
    },
  },
})

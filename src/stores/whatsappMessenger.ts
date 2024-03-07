import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useWhatsappMessengerStore = defineStore('whatsappMessenger', {
  state: () => {
    return {
      whatsappMessengerNumbers: [],
    }
  },
  getters: {
    getWhatsappMessengers(state) {
      return state.whatsappMessengerNumbers
    },
  },
  actions: {
    async fetchNumbers() {
      try {
        this.whatsappMessengerNumbers = (await api().get('/whatsapp-messenger-numbers')).data

        return this.whatsappMessengerNumbers
      } catch (response) {
        console.log('fetchWhatsappMessengers error', response)
      }
    },
    async createWhatsappMessenger(whatsappMessengerData) {
      try {
        return (await api().post('/whatsapp-messenger-numbers', whatsappMessengerData)).data
      } catch (response) {
        console.log('create whatsappMessenger error', response)

        return false
      }
    },
    async sendTestMessage() {
      try {
        return (await api().post('/whatsapp-messenger-numbers/send-test-message')).data
      } catch (response) {
        console.log('sendTestMessage error', response)

        return false
      }
    },
  },
})

import { defineStore, getActivePinia } from 'pinia'
import { getProfile } from '@/services/AuthService'
import router from '@/router/index'
import api from '@/utils/api'

export const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      settings: null
    }
  },
  getters: {
    getSettings(state) {
      return state.settings
    }
  },
  actions: {
    async fetchSettings() {
      try {
        this.settings = (await api().get('/settings')).data.settings
      } catch (response) {
        console.log('fetchSettings error', response)
      }
    },
    getSetting(name) {
      return this.settings.find((setting) => setting.name === name)
    },
    isSettingOpen(name) {
      return this.getSetting(name).value == 1
    }
  },
})

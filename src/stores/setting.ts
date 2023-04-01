import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      settings: null
    }
  },
  getters: {
    getSettings(state) {
      return state.settings
    },
    getIndexURL() {
      return getBaseUrl('/settings')
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
    async fetchSetting(settingId) {
      return (await api().get('/settings/' + settingId)).data.setting
    },
    isSettingOpen(name) {
      return this.getSetting(name).value == 1
    },
    async updateSetting(settingId, settingData) {
      try {
        return (await api().put('/settings/' + settingId, settingData)).data
      } catch (response) {
        console.log('updateSetting error', response)

        throw response
      }
    },
  },
})

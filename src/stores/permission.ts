import { defineStore } from 'pinia'
import api from '@/utils/api'

export const usePermissionStore = defineStore('permission', {
    state: () => {
        return {
            permissions: [],
        }
    },
    getters: {
        getPermissions(state) {
            return state.permissions
        }
    },
    actions: {
        async fetchPermissions() {
            try {
                this.permissions = (await api().get('/permissions')).data.permissions

                return this.permissions
            } catch (response) {
                console.log('fetchPermissions error', response)
            }
        },
    },
})

import api from '@/utils/api'
import { defineStore } from 'pinia'

type regulation = { id: string, name: string, slug: string, summary: string | null, text: string, created_at: Date, updated_at: Date }

export const useRegulationsStore = defineStore('regulations', {
    state: () => {
        return {
            regulations: [] as regulation[]
        }
    },
    getters: {
        getRegulations(state) {
            return state.regulations
        }
    },
    actions: {
        async fetchRegulations() {
            try {
                const regulations: { data: Array<regulation> } = await api().get('/regulations')
                this.regulations = regulations.data
            } catch (error) {
                throw error
            }
        },
        async fetchRegulation(slug: string) {
            try {
                return (await api().get('/regulations/' + slug)).data
            } catch (error) {
                throw error
            }
        },
        async updateRegulation(slug: string, dataToUpdate: FormData) {
            try {
                return (await api().post('/regulations/' + slug, dataToUpdate)).data
            } catch (error) {
                throw error
            }
        }
    }

})

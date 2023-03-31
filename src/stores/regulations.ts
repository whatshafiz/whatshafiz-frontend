import api from '@/utils/api'
import { defineStore } from 'pinia'

type regulation = { id: string, name: string, slug: string, summary: string | null, text: string, created_at: Date, updated_at: Date }

export const useRegulationStore = defineStore('regulations', {
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
            const regulations: { data: Array<regulation> } = await api().get('/regulations')
            if (regulations.data) {
                this.regulations = regulations.data
            }
        },

        async fetchRegulation(slug: string) {
            return (await api().get('/regulations/' + slug)).data
        },

        async updateRegulation(slug: string, dataToUpdate: FormData) {
            return (await api().post('/regulations/' + slug, dataToUpdate)).data
        }
    }

})

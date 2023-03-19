import api from '@/utils/api'
import { defineStore } from 'pinia'

type regulation = { id: string, name: string, slug: string, summary: string | null, text: string, created_at: Date, updated_at: Date }

export const useRegulationsStore = defineStore('regulations', {
    state: () => {
        return {
            regulations: []
        }
    },
    getters: {
        getRegulation(state: any) {
            return (slug: string) => {
                return state.regulations.filter((regulation: any) => regulation.slug = slug)
            }
        },
        getRegulations(state) {
            return state.regulations
        }
    },
    actions: {
        async fetchRegulations() {
            try {
                const regulations: { data: Array<regulation> } = await api().get('/regulations')
                this.regulations = regulations.data
            } catch (err) {
                console.log('err regs', err)
                throw err
            }
        },
        async fetchRegulation(slug: string) {
            try {
                const regulation: { data: Array<regulation> } = await api().get('/regulations/' + slug)
                return regulation.data
            } catch (err) {
                console.log('err hafizol', err)
            }
        },
        async updateRegulation(slug: string, dataToUpdate: { summary: string, text: string }) {
            try {
                return api().post('/regulations/' + slug, dataToUpdate)
            } catch (err: any) {
                console.log('err hafizol', err)
                throw err.message as string
            }
        }
    }

})

import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useCountryStore = defineStore('country', {
    state: () => {
        return {
            countries: [],
        }
    },
    getters: {
        getCountries(state) {
            return state.countries
        }
    },
    actions: {
        async fetchCountries() {
            try {
                this.countries = (await api().get('/countries')).data.countries

                return this.countries
            } catch (response) {
                console.log('fetchCountries error', response)
            }
        },
        async fetchCities(countryId) {
            try {
                return (await api().get('/countries/' + countryId + '/cities')).data.cities
            } catch (response) {
                console.log('fetchCountries error', response)

                return []
            }
        },
    },
})

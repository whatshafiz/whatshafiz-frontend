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
        async fetchCountryCities(countryId) {
            try {
                return (await api().get('/countries/' + countryId + '/cities')).data.cities
            } catch (response) {
                console.log('fetchCountries error', response)

                return []
            }
        },
        async createCity(countryId, cityName) {
            try {
                return (await api().post('/countries/' + countryId + '/cities', { name: cityName })).data
            } catch (response) {
                console.log('fetchCountries error', response)

                return []
            }
        },
    },
})

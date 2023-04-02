import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useCountryStore = defineStore('country', {
    state: () => {
        return {
            countries: [],
        }
    },
    getters: {
        getCountries(state) {
            return state.countries
        },
        getIndexURL() {
            return getBaseUrl('/countries/paginate')
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
                console.log('fetchCountrycities error', response)

                return []
            }
        },
        async fetchCountry(countryId) {
            try {
                return (await api().get('/countries/' + countryId)).data.country
            } catch (response) {
                console.log('fetchCountry error', response)
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
        async updateCountry(countryId, countryData) {
            try {
                return (await api().put('/countries/' + countryId, countryData)).data
            } catch (response) {
                console.log('createCountry error', response)

                throw response
            }
        },
        async deleteCountry(countryId) {
            try {
                await api().delete('/countries/' + countryId)

                return true
            } catch (response) {
                console.log('deleteCountry error', response)

                return false
            }
        },
    },
})

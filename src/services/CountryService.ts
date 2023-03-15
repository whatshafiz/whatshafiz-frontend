import api from '../utils/api'

const apiUri = '/countries'

export async function getCountries() {
    return (await api().get(apiUri)).data.countries
}

import axios from 'axios'

export function getBaseUrl(uri = '') {
    return import.meta.env.VITE_VUE_APP_BASE_API + uri
}

const api  = () => {
  return axios.create({
    baseURL: getBaseUrl(),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  })
}

export default api

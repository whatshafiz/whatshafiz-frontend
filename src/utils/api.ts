import axios from 'axios'
import { useAlertStore } from "@/stores/alert";

export function getBaseUrl(uri = '') {
    return import.meta.env.VITE_VUE_APP_BASE_API + uri
}

const api  = () => {
  const alert = useAlertStore()

  const instance = axios.create({
    baseURL: getBaseUrl(),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
  })

  instance.interceptors.request.use(function (config) {
    alert.flushMessages()

    return config
  }, function (error) {
    alert.addErrorMessage('bir hata oluştu')

    return Promise.reject(error)
  })

  instance.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 422) {
        alert.addErrorMessage(error.response.data.message)
        window.scrollTo(0, 0)
      }

      throw error
    });

  return instance
}

export default api

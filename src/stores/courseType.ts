import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useCourseTypeStore = defineStore('courseType', {
  state: () => {
    return {
      courseTypes: [],
    }
  },
  getters: {
    getCourseTypes(state) {
      return state.courseTypes
    },
    getIndexURL() {
      return getBaseUrl('/course-types/paginate')
    },
  },
  actions: {
    async fetchCourseTypes() {
      try {
        this.courseTypes = (await api().get('/course-types')).data.courseTypes

        return this.courseTypes
      } catch (response) {
        console.log('fetchCourseTypes error', response)
      }
    },
    async fetchCourseType(courseTypeId) {
      try {
        return (await api().get('/course-types/' + courseTypeId)).data.courseType
      } catch (response) {
        console.log('fetchCourseType error', response)
      }
    },
    async createCourseType(courseTypeData) {
      try {
        return (await api().post('/course-types', courseTypeData)).data
      } catch (response) {
        console.log('create courseType error', response)

        return false
      }
    },
    async updateCourseType(courseTypeId, courseTypeData) {
      try {
        return (await api().put('/course-types/' + courseTypeId, courseTypeData)).data
      } catch (response) {
        console.log('update courseType error', response)

        return false
      }
    },
    async deleteCourseType(courseTypeId) {
      try {
        await api().delete('/course-types/' + courseTypeId)

        return true
      } catch (response) {
        console.log('deleteCourseType error', response)

        return false
      }
    },
  },
})

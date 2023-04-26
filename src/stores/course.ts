import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useCourseStore = defineStore('course', {
  state: () => {
    return {
      courseApplyTypes: ['whatsenglish', 'whatsarapp', 'hafizol', 'hafizkal'],
      courseTypes: ['whatsenglish', 'whatsarapp', 'whatshafiz'],
      courses: null,
      availableCourses: null
    }
  },
  getters: {
    getCourseApplyTypes(state) {
      return state.courseApplyTypes
    },
    getCourseTypes(state) {
      return state.courseTypes
    },
    getCourses(state) {
      return state.courses
    },
    getAvailableCourses(state) {
      return state.availableCourses
    },
    getIndexURL() {
      return getBaseUrl('/courses/paginate')
    },
    getMyIndexURL() {
      return getBaseUrl('/my/courses')
    },
  },
  actions: {
    async fetchCourses() {
      try {
        this.courses = (await api().get('/courses')).data.courses

        return this.courses
      } catch (response) {
        console.log('fetchSettings error', response)

        return []
      }
    },
    async fetchAvailableCourses() {
      try {
        this.availableCourses = (await api().get('/courses/available')).data

        return this.availableCourses
      } catch (response) {
        console.log('fetchSettings error', response)
      }
    },
    async hasAvailableCourse(courseType) {
      if (this.availableCourses === null) {
        await this.fetchAvailableCourses()
      }

      if (['hafizol', 'hafizkal'].includes(courseType)) {
        courseType = 'whatshafiz'
      }

      return this.availableCourses.find((course) => course.type === courseType)
    },
    async fetchCourse(courseId) {
      try {
        return (await api().get('/courses/' + courseId)).data.course
      } catch (response) {
        console.log('fetchCourse error', response)
      }
    },
    async registerUserToCourse(registrationData) {
      try {
        return await api().post('/profile/courses', registrationData)
      } catch (response) {
        console.log('register course error', response)

        return response.response
      }
    },
    async createCourse(courseData) {
      try {
        await api().post('/courses', courseData)

        return true
      } catch (response) {
        console.log('create course error', response)

        return false
      }
    },
    async updateCourse(courseId, courseData) {
      try {
        await api().put('/courses/' + courseId, courseData)

        return true
      } catch (response) {
        console.log('update course error', response)

        return false
      }
    },
    async deleteCourse(courseId) {
      try {
        await api().delete('/courses/' + courseId)

        return true
      } catch (response) {
        console.log('deleteCourse error', response)

        return false
      }
    },
  },
})

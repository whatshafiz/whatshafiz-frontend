import { defineStore, getActivePinia } from 'pinia'
import router from '@/router/index'
import api from '@/utils/api'

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
    }
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
    }
  },
})

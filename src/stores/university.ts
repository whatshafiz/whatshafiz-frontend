import { defineStore } from 'pinia'
import api from '@/utils/api'

export const useUniversityStore = defineStore('university', {
    state: () => {
        return {
            universities: [],
        }
    },
    getters: {
        getUniversities(state) {
            return state.universities
        }
    },
    actions: {
        async fetchUniversities() {
            try {
                this.universities = (await api().get('/universities')).data.universities

                return this.universities
            } catch (response) {
                console.log('fetchUniversities error', response)
            }
        },
        async fetchUniversityFaculties(universityId) {
            try {
                return (await api().get('/universities/' + universityId + '/faculties')).data.faculties
            } catch (response) {
                console.log('fetchFaculties error', response)

                return []
            }
        },
        async fetchUniversityFacultyDepartments(universityId, facultyId) {
            try {
                return (await api().get('/universities/' + universityId + '/faculties/' + facultyId + '/departments')).data.departments
            } catch (response) {
                console.log('fetchFaculties error', response)

                return []
            }
        },
        async createUniversity(universityName) {
            try {
                return (await api().post('/universities', { name: universityName })).data
            } catch (response) {
                console.log('create university error', response)

                return []
            }
        },
        async createUniversityFaculty(universityId, facultyName) {
            try {
                return (await api().post('/universities/' + universityId + '/faculties', { name: facultyName })).data
            } catch (response) {
                console.log('create university error', response)

                return []
            }
        },
        async createUniversityFacultyDepartment(universityId, facultyId, departmentName) {
            try {
                return (await api().post('/universities/' + universityId + '/faculties/' + facultyId + '/departments', { name: departmentName })).data
            } catch (response) {
                console.log('create university error', response)

                return []
            }
        },
    },
})

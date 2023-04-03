import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useUniversityStore = defineStore('university', {
    state: () => {
        return {
            universities: [],
        }
    },
    getters: {
        getUniversities(state) {
            return state.universities
        },
        getIndexURL() {
            return getBaseUrl('/universities/paginate')
        },
        getFacultiesIndexURL() {
            return getBaseUrl('/faculties/paginate')
        },
        getDepartmentsIndexURL() {
            return getBaseUrl('/departments/paginate')
        },
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
        async fetchUniversity(universityId) {
            try {
                return (await api().get('/universities/' + universityId)).data
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
        async fetchUniversityFaculty(facultyId) {
            try {
                return (await api().get('/faculties/' + facultyId)).data
            } catch (response) {
                console.log('fetchFaculty error', response)
            }
        },
        async fetchUniversityFacultyDepartments(universityId, facultyId) {
            try {
                return (await api().get('/universities/' + universityId + '/faculties/' + facultyId + '/departments')).data.departments
            } catch (response) {
                console.log('fetchFacultyDepartments error', response)

                return []
            }
        },
        async fetchUniversityFacultyDepartment(departmentId) {
            try {
                return (await api().get('/departments/' + departmentId)).data
            } catch (response) {
                console.log('fetchFacultyDepartments error', response)

                return []
            }
        },
        async createUniversity(universityName) {
            try {
                return (await api().post('/universities', { name: universityName })).data
            } catch (response) {
                console.log('create university error', response)

                return false
            }
        },
        async createUniversityFaculty(universityId, facultyName) {
            try {
                return (await api().post('/universities/' + universityId + '/faculties', { name: facultyName })).data
            } catch (response) {
                console.log('create university faculty error', response)

                return false
            }
        },
        async createUniversityFacultyDepartment(universityId, facultyId, departmentName) {
            try {
                return (await api().post('/universities/' + universityId + '/faculties/' + facultyId + '/departments', { name: departmentName })).data
            } catch (response) {
                console.log('create university department error', response)

                return false
            }
        },
        async updateUniversity(universityId, universityName) {
            try {
                return (await api().put('/universities/' + universityId, { name: universityName })).data
            } catch (response) {
                console.log('update university error', response)

                return false
            }
        },
        async updateUniversityFaculty(facultyId, facultyData) {
            try {
                return (await api().put('/faculties/' + facultyId, facultyData)).data
            } catch (response) {
                console.log('update faculty error', response)

                return false
            }
        },
        async updateUniversityFacultyDepartment(departmentId, departmentData) {
            try {
                return (await api().put('/departments/' + departmentId, departmentData)).data
            } catch (response) {
                console.log('update department error', response)

                return false
            }
        },
        async deleteUniversity(universityId) {
            try {
                await api().delete('/universities/' + universityId)

                return true
            } catch (response) {
                console.log('deleteUniversity error', response)

                return false
            }
        },
        async deleteFaculty(facultyId) {
            try {
                await api().delete('/faculties/' + facultyId)

                return true
            } catch (response) {
                console.log('deleteFaculty error', response)

                return false
            }
        },
        async deleteDepartment(departmentId) {
            try {
                await api().delete('/departments/' + departmentId)

                return true
            } catch (response) {
                console.log('deleteDepartment error', response)

                return false
            }
        },
    },
})

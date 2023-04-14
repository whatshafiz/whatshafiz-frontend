import { defineStore } from 'pinia'
import api from '@/utils/api'
import { getBaseUrl } from '@/utils/api'

export const useCommentsStore = defineStore('comment', {
  state: () => {
    return {
      comments: [],
    }
  },
  getters: {
    getComments(state) {
      return state.comments
    },
    getIndexURL() {
      return getBaseUrl('/comments')
    },
    getMyIndexURL() {
      return getBaseUrl('/my/comments')
    },
    getUnapprovedIndexURL() {
      return getBaseUrl('/comments?is_approved=0')
    },
  },
  actions: {
    async fetchComments() {
      try {
        this.comments = (await api().get('/comments')).data.comments

        return this.comments
      } catch (response) {
        console.log('fetchComments error', response)
      }
    },
    async fetchComment(commentId) {
      try {
        return (await api().get('/comments/' + commentId)).data.comment
      } catch (response) {
        console.log('fetchComment error', response)
      }
    },
    async createComment(commentData) {
      try {
        await api().post('/comments', commentData)

        return true
      } catch (response) {
        console.log('create comment error', response)

        return false
      }
    },
    async updateComment(commentId, commentData) {
      try {
        await api().put('/comments/' + commentId, commentData)

        return true
      } catch (response) {
        console.log('update comment error', response)

        return false
      }
    },
    async deleteComment(commentId) {
      try {
        await api().delete('/comments/' + commentId)

        return true
      } catch (response) {
        console.log('deleteComment error', response)

        return false
      }
    },
  },
})

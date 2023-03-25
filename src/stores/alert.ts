import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
    state: () => {
        return {
            successMessages: [],
            warningMessages: [],
            errorMessages: [],
        }
    },
    getters: {
        getSuccessMessages(state) {
            return state.successMessages
        },
        getWarningMessages(state) {
            return state.warningMessages
        },
        getErrorMessages(state) {
            return state.errorMessages
        },
        hasAlertMessage(state) {
            return state.warningMessages.length > 0 ||
                state.errorMessages.length > 0 ||
                state.successMessages.length > 0
        },
        hasSuccessMessage(state) {
            return state.successMessages.length > 0
        },
        hasWarningMessage(state) {
            return state.warningMessages.length > 0
        },
        hasErrorMessage(state) {
            return state.errorMessages.length > 0
        },
    },
    actions: {
        addSuccessMessage(message: string) {
            this.successMessages.push(message)
        },
        addWarningMessage(message: string) {
            this.warningMessages.push(message)
        },
        addErrorMessage(message: string) {
            this.errorMessages.push(message)
        },
        flushMessages() {
            this.successMessages = []
            this.warningMessages = []
            this.errorMessages = []
        }
    },
})

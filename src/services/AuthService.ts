import { useUserStore } from '@/stores/user'
import api from '@/utils/api'

export async function checkUser(phoneNumber) {
    return (await api().post('/users/check', { phone_number: phoneNumber })).data
}

export async function sendForgotPasswordCode(phoneNumber) {
    return (await api().post('/forgot-password', { phone_number: phoneNumber })).data
}

export async function updatePassword(forgotPasswordFormData) {
    return (await api().post('/update-password', forgotPasswordFormData)).data
}

export async function sendPhoneNumberVerificationCode() {
    return (await api().post('/register/verification-code/send')).data
}

export async function checkPhoneNumberVerificationCode(verificationCode) {
    return (await api().post('/register/verification-code/verify', { code: verificationCode })).data
}

export async function loginUser(loginFormData) {
    return (await api().post('/login', loginFormData)).data
}

export async function registerUser(registerFormData) {
    return (await api().post('/register', registerFormData)).data
}

export async function getProfile() {
    return (await api().get('/profile')).data
}

export async function isLoggedIn() {
    const user = useUserStore()

    if (!user.isLoggedIn()) {
        return false
    }

    let userData = null

    try {
        userData = (await getProfile())
    } catch (e) {
        return false
    }

    if (!userData.user) {
        return false
    }

    user.setProfile(userData)

    return true
}

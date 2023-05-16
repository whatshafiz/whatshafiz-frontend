<script setup async lang="ts">
import DarkModeSwitcher from '../components/DarkModeSwitcher'
import logoUrl from '../assets/images/logo-transparent.png'
import { FormInput, FormLabel } from '../base-components/Form'
import Button from '../base-components/Button'
import LoadingIcon from '../base-components/LoadingIcon'
import TomSelect from '../base-components/TomSelect'
import Alert from '../base-components/Alert'
import Lucide from '../base-components/Lucide'
import { onBeforeMount, ref, watch } from 'vue'
import { getCountries } from '@/services/CountryService'
import { checkUser, loginUser, registerUser, sendForgotPasswordCode, updatePassword } from '@/services/AuthService'
import { useRouter, useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/course'

const router = useRouter()
const route = useRoute()
const countryPhoneCode = ref('90')
const phoneNumber = ref('')
const password = ref('')
const countries = ref('[]')
const errorMessage = ref('')
const successMessage = ref('')
const warningMessage = ref('')
const activeForm = ref('loginForm')
const isLoading = ref(false)
const loginFormData = ref({
  phone_number: '',
  password: ''
})
const registerFormData = ref({
  phone_number: '',
  password: '',
  password_confirmation: ''
})
const forgotPasswordFormData = ref({
  phone_number: null,
  verification_code: null,
  password: null,
  password_confirmation: null,
  password_reset_code_valid_until: null
})

onBeforeMount(async () => {
  if (route.name === 'register') {
    localStorage.setItem('newCourseRegisterType', route.query.type)
  }

  if (localStorage.getItem('token')) {
    activeForm.value = null

    return router.push({ name: 'dashboard' })
  }

  if (localStorage.getItem('countryCode')) {
    countryPhoneCode.value = localStorage.getItem('countryCode')
  }

  countries.value = await getCountries()
})

watch(countryPhoneCode, (newValue) => {
  localStorage.setItem('countryCode', newValue)
})

const resetForm = () => {
  isLoading.value = false
  phoneNumber.value = ''
  password.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  warningMessage.value = ''
  loginFormData.value.phone_number = ''
  loginFormData.value.password = ''
  registerFormData.value.phone_number = ''
  registerFormData.value.password = ''
  registerFormData.value.password_confirmation = ''
  activeForm.value = 'loginForm'
}

const checkPhoneNumber = () => {
  errorMessage.value = ''
  warningMessage.value = ''

  if (countryPhoneCode.value === '90' && (isNaN(phoneNumber.value) || phoneNumber.value.toString().length !== 10)) {
    warningMessage.value = 'Telefon numarası hatalı!'

    return
  }

  isLoading.value = true

  checkUser(countryPhoneCode.value + '' + phoneNumber.value).then(response => {
    isLoading.value = false

    if (response.is_banned) {
      errorMessage.value = 'Bu kullanıcı engellenmiştir!'

      return
    }

    if (response.is_registered) {
      loginFormData.value.phone_number = response.phone_number
      activeForm.value = 'passwordForm'

      return
    }

    if (route.name !== 'register') {
      warningMessage.value = 'Bu telefon numarası ile kayıtlı kullanıcı yok.'

      return
    }

    const courseStore = useCourseStore()
    const courseApplyType = route.query.type

    if (!courseApplyType || !courseStore.getCourseApplyTypes.find(type => type === courseApplyType)) {
      warningMessage.value = 'Kayıt yapılabilir bir kurs tipi bulunamadı!'

      return
    }

    if (courseStore.hasAvailableCourse(courseApplyType)) {
      registerFormData.value.phone_number = response.phone_number
      activeForm.value = 'registerForm'

      return
    }

    warningMessage.value = 'Başvuraya açık kurs bulunamadı!'
  })
}

const login = () => {
  errorMessage.value = ''
  warningMessage.value = ''

  if (password.value.length < 5) {
    warningMessage.value = 'Parolanızı eksik veya hatalı yazdınız!'

    return
  }

  loginFormData.value.password = password
  isLoading.value = true

  loginUser(loginFormData.value)
    .then(response => {
      isLoading.value = false

      if (response.token) {
        localStorage.setItem('token', response.token)
        activeForm.value = null

        return router.push({ name: 'dashboard' })
      }
    })
    .catch(response => {
      isLoading.value = false

      if (response.response.data.message) {
        errorMessage.value = response.response.data.message

        return
      }

      errorMessage.value = 'Bir hata oluştu, daha sonra tekrar deneyin!'
    })
}

const register = () => {
  errorMessage.value = ''
  warningMessage.value = ''

  if (registerFormData.value.password.length < 5) {
    warningMessage.value = 'Parolanız en az 5 karakter olmalı!'

    return
  }

  if (registerFormData.value.password !== registerFormData.value.password_confirmation) {
    warningMessage.value = 'Parolalar eşleşmiyor, lütfen tekrar deneyin.'
    registerFormData.value.password = ''
    registerFormData.value.password_confirmation = ''

    return
  }

  isLoading.value = true

  registerUser(registerFormData.value)
    .then(response => {
      isLoading.value = false

      if (response.token) {
        localStorage.setItem('token', response.token)
        activeForm.value = null

        return router.push({ name: 'dashboard' })
      }
    })
    .catch(response => {
      isLoading.value = false

      if (response.response.data.message) {
        errorMessage.value = response.response.data.message

        return
      }

      errorMessage.value = 'Bir hata oluştu, daha sonra tekrar deneyin!'
    })
}

const sendForgotPasswordCodeToWhatsapp = () => {
  errorMessage.value = ''
  warningMessage.value = ''

  if (countryPhoneCode.value === '90' && (isNaN(phoneNumber.value) || phoneNumber.value.toString().length !== 10)) {
    warningMessage.value = 'Telefon numarası hatalı!'

    return
  }

  isLoading.value = true

  sendForgotPasswordCode(countryPhoneCode.value + '' + phoneNumber.value)
    .then(response => {
      isLoading.value = false

      if (response.message) {
        successMessage.value = response.message
        warningMessage.value = 'Lütfen gelen mesajı <strong>Spam Değil</strong> olarak işaretleyin.'
      }

      if (response.password_reset_code_valid_until) {
        forgotPasswordFormData.value.password_reset_code_valid_until = response.password_reset_code_valid_until
      }

      forgotPasswordFormData.value.phone_number = countryPhoneCode.value + '' + phoneNumber.value
      activeForm.value = 'updatePasswordForm'
    })
    .catch(response => {
      isLoading.value = false

      if (response.response.data.message) {
        errorMessage.value = response.response.data.message

        return
      }

      errorMessage.value = 'Bir hata oluştu, daha sonra tekrar deneyin!'
    })
}

const updateForgotPassword = () => {
  errorMessage.value = ''
  warningMessage.value = ''

  if (countryPhoneCode.value === '90' && (isNaN(phoneNumber.value) || phoneNumber.value.toString().length !== 10)) {
    warningMessage.value = 'Telefon numarası hatalı!'

    return
  }

  isLoading.value = true

  updatePassword(forgotPasswordFormData.value)
    .then(response => {
      resetForm()

      if (response.message) {
        successMessage.value = response.message
      }
    })
    .catch(response => {
      isLoading.value = false

      if (response.response.data.message) {
        errorMessage.value = response.response.data.message

        return
      }

      errorMessage.value = 'Bir hata oluştu, daha sonra tekrar deneyin!'
    })
}
</script>

<template>
  <div
    v-if="activeForm !== null"
    :class="[
      'sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]"
  >
    <DarkModeSwitcher />
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col xl:min-h-screen flex h-2">
          <div class="my-auto">
            <img
              alt="WhatsHafız Logo"
              class="xl:w-1/2 xl:-mt-16 -intro-x m-auto"
              :src="logoUrl"
            />
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2
              class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left !z-20"
            >
              WhatsHafız Panel
            </h2>
            <div class="mt-4 transition-all linear duration-[400ms]" v-show="successMessage">
              <Alert variant="soft-success" class="flex items-center mb-2">
                  <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
                  {{ successMessage }}
              </Alert>
            </div>
            <div class="mt-4 transition-all linear duration-[400ms]" v-show="warningMessage">
              <Alert variant="soft-warning" class="flex items-center mb-2">
                  <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
                  <span v-html="warningMessage"></span>
              </Alert>
            </div>
            <div class="mt-4 transition-all linear duration-[400ms]" v-show="errorMessage">
              <Alert variant="soft-danger" class="flex items-center mb-2">
                  <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
                  {{ errorMessage }}
              </Alert>
            </div>
            <div v-if="activeForm === 'loginForm'" class="mt-8 intro-x">
              <div>
                <label>Ülke Kodu:</label>
                <div class="mt-2">
                  <TomSelect
                    v-model="countryPhoneCode"
                    :options="{
                      placeholder: 'Ülke kodunu seçin.',
                    }"
                    class="w-full"
                  >
                    <option v-for="country in countries" :key="country.id" :value="country.phone_code">
                      ({{ country.phone_code }}) {{ country.name }}
                    </option>
                  </TomSelect>
                </div>
              </div>
              <div class="mt-4">
                <FormLabel htmlFor="phoneNumber">Telefon No:</FormLabel>
                <FormInput
                  id="phoneNumber"
                  v-model="phoneNumber"
                  :value="phoneNumber"
                  type="number"
                  :autofocus="true"
                  @keyup.enter.native="checkPhoneNumber"
                  class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                  :placeholder="countryPhoneCode === '90' ? '5XXXXXXXXX' : 'Telefon Numaranız'"
                />
              </div>
              <div class="mt-4 text-center intro-x xl:mt-6 xl:text-right">
                <Button
                  @click.prevent="checkPhoneNumber"
                  variant="primary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                  :disabled="isLoading"
                >
                  <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-2" />
                  Devam Et
                </Button>
              </div>
            </div>
            <div v-if="activeForm === 'passwordForm'" class="mt-6 intro-x">
              <FormLabel htmlFor="password">Parola:</FormLabel>
              <FormInput
                id="password"
                type="password"
                v-model="password"
                :value="password"
                :autofocus="true"
                @keyup.enter.native="login"
                class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Parolanızı Yazın"
              />
              <div class="mt-4 text-center intro-x xl:text-right">
                <Button
                  @click.prevent="resetForm"
                  variant="outline-secondary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  İptal
                </Button>
                <Button
                  @click.prevent="login"
                  variant="primary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                  :disabled="isLoading"
                >
                  <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-2" />
                  Giriş Yap
                </Button>
              </div>
              <div class="flex mt-12 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm justify-center cursor-pointer hover:underline">
                <a @click="activeForm = 'forgotNumberForm'">Parolamı Unuttum</a>
              </div>
            </div>
            <div v-if="activeForm === 'registerForm'" class="mt-6 intro-x">
              <div class="max-w-full">
                <div class="mt-4">
                  <FormLabel htmlFor="password">Parolanız:</FormLabel>
                  <FormInput
                    id="password"
                    type="password"
                    v-model="registerFormData.password"
                    :value="registerFormData.password"
                    :autofocus="true"
                    class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Parola"
                  />
                </div>
                <div class="mt-4">
                  <FormLabel htmlFor="password_confirmation">Parolanızı Tekrar Yazın:</FormLabel>
                  <FormInput
                    id="password_confirmation"
                    type="password"
                    v-model="registerFormData.password_confirmation"
                    :value="registerFormData.password_confirmation"
                    :autofocus="true"
                    class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Parola Tekrar"
                  />
                </div>
              </div>
              <div class="mt-4 text-center intro-x xl:text-center">
                <Button
                  @click.prevent="resetForm"
                  variant="outline-secondary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  İptal
                </Button>
                <Button
                  @click.prevent="register"
                  variant="primary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-64 xl:mt-0"
                  :disabled="isLoading"
                >
                  <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-2" />
                  Kayıt Ol
                </Button>
              </div>
            </div>
            <div v-if="loginFormData.phone_number && activeForm === 'forgotNumberForm'" class="mt-6 intro-x">
              <div class="max-w-full">
                <Alert variant="secondary" class="flex items-center mb-2 text-center">
                    <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" />
                    Parolanızı yenileyebilmeniz için <br>
                      telefon numaranıza ({{ loginFormData.phone_number }}) <br>
                      WhatsApp üzerinden doğrulama kodu gönderilecektir.
                </Alert>
              </div>
              <div class="mt-4 text-center intro-x xl:text-center">
                <Button
                  @click.prevent="resetForm"
                  variant="outline-secondary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  İptal
                </Button>
                <Button
                  @click.prevent="sendForgotPasswordCodeToWhatsapp"
                  variant="primary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-64 xl:mt-0"
                  :disabled="isLoading"
                >
                  <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-2" />
                  WhatsApp'a Kodu Gönder
                </Button>
              </div>
            </div>
            <div v-if="forgotPasswordFormData.phone_number && activeForm === 'updatePasswordForm'" class="mt-6 intro-x">
              <div class="max-w-full">
                <div class="mt-4">
                  <FormLabel htmlFor="verification_code">Doğrulama Kodu:</FormLabel>
                  <FormInput
                    id="verification_code"
                    type="number"
                    v-model="forgotPasswordFormData.verification_code"
                    :value="forgotPasswordFormData.verification_code"
                    :autofocus="true"
                    class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Doğrulama Kodunu Yazın"
                  />
                </div>
                <div class="mt-4">
                  <FormLabel htmlFor="password">Yeni Parola:</FormLabel>
                  <FormInput
                    id="password"
                    type="password"
                    v-model="forgotPasswordFormData.password"
                    :value="forgotPasswordFormData.password"
                    :autofocus="true"
                    class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Parola"
                  />
                </div>
                <div class="mt-4">
                  <FormLabel htmlFor="password_confirmation">Yeni Parolanızı Tekrar Yazın:</FormLabel>
                  <FormInput
                    id="password_confirmation"
                    type="password"
                    v-model="forgotPasswordFormData.password_confirmation"
                    :value="forgotPasswordFormData.password_confirmation"
                    :autofocus="true"
                    class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Parola Tekrar"
                  />
                </div>
              </div>
              <div class="mt-4 text-center intro-x xl:text-center">
                <Button
                  @click.prevent="resetForm"
                  variant="outline-secondary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  İptal
                </Button>
                <Button
                  @click.prevent="updateForgotPassword"
                  variant="primary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-64 xl:mt-0"
                  :disabled="isLoading"
                >
                  <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-2" />
                  Gönder
                </Button>
              </div>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

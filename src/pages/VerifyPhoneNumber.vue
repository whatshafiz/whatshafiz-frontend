<script setup async lang="ts">
import DarkModeSwitcher from '../components/DarkModeSwitcher'
import logoUrl from '../assets/images/logo-transparent.png'
import { FormInput, FormLabel } from '../base-components/Form'
import Button from '../base-components/Button'
import Alert from '../base-components/Alert'
import Lucide from '../base-components/Lucide'
import { onMounted, ref } from 'vue'
import { sendPhoneNumberVerificationCode, checkPhoneNumberVerificationCode } from '@/services/AuthService'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')
const warningMessage = ref('')
const verificationCode = ref(null)
const verificationCodeValidUntil = ref(null)

onMounted(async () => {
  if (!user.profile.phone_number) {
    user.logout()
  }
})

const resetForm = () => {
  errorMessage.value = ''
  successMessage.value = ''
  warningMessage.value = ''
}

const sendVerificationCodeToWhatsapp = () => {
  resetForm()

  sendPhoneNumberVerificationCode()
    .then(response => {
      if (response.message) {
        successMessage.value = response.message
        warningMessage.value = 'Lütfen gelen mesajı <strong>Spam Değil</strong> olarak işaretleyin.'
      }

      if (response.verification_code_valid_until) {
        verificationCodeValidUntil.value = response.verification_code_valid_until
      }
    })
    .catch(response => {
      if (response.response.data.message) {
        errorMessage.value = response.response.data.message

        return
      }

      errorMessage.value = 'Bir hata oluştu, daha sonra tekrar deneyin!'
    })
}

const checkVerificationCode = () => {
  resetForm()

  if (verificationCode.value.length !== 6) {
    warningMessage.value = 'Doğrulama kodu hatalı!'

    return
  }

  checkPhoneNumberVerificationCode(verificationCode.value)
    .then(response => {
      if (response.message) {
        successMessage.value = response.message
        router.push({ name: 'dashboard' })
      }
    })
    .catch(response => {
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
    :class="[
      '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
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
              class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left"
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
            <div v-if="!verificationCodeValidUntil" class="mt-6 intro-x">
              <div class="max-w-full">
                <Alert variant="secondary" class="flex items-center mb-2 text-center">
                    <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" />
                    Telefon numaranıza ({{ user.profile.phone_number }}) <br>
                      WhatsApp üzerinden doğrulama kodu gönderilecektir.
                </Alert>
              </div>
              <div class="mt-4 text-center intro-x xl:text-center">
                <Button
                  @click.prevent="user.logout()"
                  variant="outline-secondary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  İptal
                </Button>
                <Button
                  @click.prevent="sendVerificationCodeToWhatsapp"
                  variant="primary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-64 xl:mt-0"
                >
                  WhatsApp'a Kodu Gönder
                </Button>
              </div>
            </div>
            <div v-else class="mt-6 intro-x">
              <div class="max-w-full">
                <div class="mt-4">
                  <FormLabel htmlFor="verificationCode">Doğrulama Kodu:</FormLabel>
                  <FormInput
                    id="verificationCode"
                    type="text"
                    v-model="verificationCode"
                    :value="verificationCode"
                    :autofocus="true"
                    class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                    placeholder="Doğrulama Kodunu Yazın"
                  />
                </div>
              </div>
              <div class="mt-4 text-center intro-x xl:text-center">
                <Button
                  @click.prevent="user.logout()"
                  variant="outline-secondary"
                  class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  İptal
                </Button>
                <Button
                  @click.prevent="checkVerificationCode"
                  variant="primary"
                  class="w-full px-4 py-3 mt-3 align-top xl:w-64 xl:mt-0"
                >
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

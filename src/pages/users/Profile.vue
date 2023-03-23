<script setup lang="ts">
import {
  FormSwitch,
  FormLabel,
  FormInput,
  FormTextarea,
} from "@/base-components/Form";
import Button from "@/base-components/Button";
import Notification from "@/base-components/Notification";
import Lucide from "@/base-components/Lucide";
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from "@/base-components/TomSelect";
import Toastify from "toastify-js";
import { reactive, toRefs, ref, onBeforeMount, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useCountryStore } from "@/stores/country";
import { storeToRefs } from "pinia"

const isLoading = ref(false)
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const countryStore = useCountryStore()

const isEditForm = ref(false)
const countries = ref([])
const cities = ref([])
const genderField = ref(null)

const fetchCountries = async () => {
  if (countries.value.length > 1) {

    return
  }

  await countryStore.fetchCountries()
  countries.value = countryStore.getCountries
}

const fetchCities = async (newCountryId) => {
  cities.value = await countryStore.fetchCities(newCountryId)
}

const makeFormEditable = () => {
  isEditForm.value = true
  fetchCountries()
  fetchCities(profile.value.country_id)


}

const onSubmit = async () => {
  isLoading.value = true

  try {
    await userStore.saveProfile()
    isLoading.value = false
    isEditForm.value = false
  } catch (response) {
    console.log(response)
    isLoading.value = false
  }
};

if (isEditForm.value || !profile.value.gender) {
  makeFormEditable()
} else {
  if (profile.value.country) {
    countries.value.push(profile.value.country)
  }

  if (profile.value.city) {
    cities.value.push(profile.value.city)
  }
}
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Profil Bilgileri</h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-12 intro-y lg:col-span-6">
      <!-- BEGIN: Form Validation -->
      <div class="intro-y box">
        <div
          class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400"
        >
          <h2 class="mr-auto text-base font-medium">Profil</h2>
          <FormSwitch v-if="!isEditForm" class="w-full mt-3 sm:w-auto sm:ml-auto sm:mt-0">
            <FormLabel htmlFor="is_edit">
              Düzenle
            </FormLabel>
            <FormSwitch.Input
              id="is_edit"
              @click="makeFormEditable()"
              class="ml-3 mr-0"
              type="checkbox"
            />
          </FormSwitch>
        </div>
        <div class="p-5">
            <!-- BEGIN: Validation Form -->
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Ad
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="name"
                  v-model="profile.name"
                  :disabled="!isEditForm"
                  type="text"
                  name="name"
                  placeholder="Adınız"
                />
              </div>
              <div class="mt-3 input-form">
                <FormLabel
                  htmlFor="surname"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Soyad
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="surname"
                  v-model="profile.surname"
                  :disabled="!isEditForm"
                  type="text"
                  name="surname"
                  placeholder="Soyadınız"
                />
              </div>
              <div class="mt-3 input-form">
                <FormLabel
                  htmlFor="phone_number"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Telefon No
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Değiştirilemez
                  </span>
                </FormLabel>
                <FormInput
                  id="phone_number"
                  v-model="profile.phone_number"
                  type="text"
                  name="phone_number"
                  readonly
                  placeholder="Telefon No"
                />
              </div>
              <div class="mt-3 input-form">
                <FormLabel
                  htmlFor="gender"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Cinsiyet
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  id="gender"
                  ref="genderField"
                  :disabled="!isEditForm"
                  v-model="profile.gender"
                  :options="{ placeholder: 'Cinsiyet Seçin' }"
                  class="w-full"
                >
                  <option value="">Seçim Yapın</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </TomSelect>
              </div>
              <div class="mt-3 input-form">
                <FormLabel
                  htmlFor="email"
                  class="flex flex-col w-full sm:flex-row"
                >
                  E-posta
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    İsteğe Bağlı
                  </span>
                </FormLabel>
                <FormInput
                  id="email"
                  v-model="profile.email"
                  type="email"
                  name="email"
                  placeholder="ornek@gmail.com"
                />
              </div>
              <div class="mt-3 input-form">
                <FormLabel
                  htmlFor="country_id"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Ülke
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  id="country_id"
                  v-model="profile.country_id"
                  :options="{
                    placeholder: 'Ülke Seçin',
                    onChange: (newCountryId) => { fetchCities(newCountryId) },
                  }"
                  class="w-full"
                >
                    <option v-for="country in countries" :key="country.id" :value="country.id">
                      {{ country.name }}
                    </option>
                </TomSelect>
              </div>
              <div class="mt-3 input-form">
                <FormLabel
                  htmlFor="city_id"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Şehir
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  id="city_id"
                  name="city_id"
                  required
                  v-model="profile.city_id"
                  :options="{ placeholder: 'Şehir Seçin' }"
                  class="w-full"
                >
                    <option v-for="city in cities" :key="city.id" :value="city.id">
                      {{ city.name }}
                    </option>
                </TomSelect>
              </div>
              <Button
                v-if="isEditForm"
                variant="primary"
                type="submit"
                class="mt-5"
                :disabled="isLoading"
              >
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-2" />
                Kaydet
              </Button>
            </form>
        </div>
      </div>
      <!-- END: Form Validation -->
      <!-- BEGIN: Success Notification Content -->
      <Notification id="success-notification-content" class="flex hidden">
        <Lucide icon="CheckCircle" class="text-success" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Registration success!</div>
          <div class="mt-1 text-slate-500">
            Please check your e-mail for further info!
          </div>
        </div>
      </Notification>
      <!-- END: Success Notification Content -->
      <!-- BEGIN: Failed Notification Content -->
      <Notification id="failed-notification-content" class="flex hidden">
        <Lucide icon="XCircle" class="text-danger" />
        <div class="ml-4 mr-4">
          <div class="font-medium">Registration failed!</div>
          <div class="mt-1 text-slate-500">Please check the fileld form.</div>
        </div>
      </Notification>
      <!-- END: Failed Notification Content -->
    </div>
  </div>
  <!-- END: Page Layout -->
</template>

<script setup lang="ts">
import { FormLabel, FormInput, FormSwitch } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import Lucide from "@/base-components/Lucide";
import { ref, reactive, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCountryStore } from "@/stores/country"
import Table from "@/base-components/Table";
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const countryStore = useCountryStore()
const countries = ref([])
const city = reactive({
  country_id: null,
  name: '',
})

onBeforeMount(async () => {
  countries.value = await countryStore.fetchCountries()
})

const onSubmit = async () => {
  isLoading.value = true
  console.log('erkan')

  try {
    await countryStore.createCity(city.country_id, city.name)
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Yeni Şehir Oluşturuldu.')
    router.push({ name: 'cities.index' })
  } catch (response) {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
};
</script>

<template>
  <div v-if="user.can('countries.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Şehir Oluştur</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Şehir Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form" v-if="countries.length > 0">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Ülke
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect v-model="city.country_id" :options="{placeholder: 'Ülke seçin.'}" class="w-full">
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="city.name" :value="city.name" type="text" name="name" required
                  placeholder="Şehir Adını Yazın" />
              </div>

              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <RouterLink :to="{ name: 'countries.index' }">
                <Button variant="outline-secondary" type="button" class="mt-5 mr-5">
                  İptal
                </Button>
              </RouterLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormLabel, FormInput, FormSwitch } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import Lucide from "@/base-components/Lucide";
import { ref, reactive, onMounted, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCountryStore } from "@/stores/country"
import { useAlertStore } from "@/stores/alert";
import Table from "@/base-components/Table";
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')
const isLoading = ref(false)
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const countryStore = useCountryStore()
const countryId = route.params.countryId
const country = ref({})
const cities = ref([])

onMounted(async () => {
  country.value = await countryStore.fetchCountry(countryId)
  cities.value = await countryStore.fetchCountryCities(countryId)
})

const deleteCity = async (cityId) => {
  if (await countryStore.deleteCity(cityId)) {
    successNotificationToggle('İşlem Başarılı', 'Şehir Silindi!')
    cities.value = await countryStore.fetchCountryCities(countryId)
  } else {
    errorNotificationToggle('HATA', 'Şehir Silinemedi!')
  }
}

const deleteCityWithModal = (cityId) => {
  alertStore.setDeleteModalPreview(true)
  alertStore.setDeleteModalAction(() => deleteCity(cityId))
}

const onSubmit = async () => {
  isLoading.value = true

  try {
    await countryStore.updateCountry(countryId, country.value)
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Ülke bilgileri güncellendi.')
    router.push({ name: 'countries.index' })
  } catch (response) {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
};
</script>

<template>
  <div v-if="user.can('countries.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Ülke Bilgilerini Düzenle</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-5">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Ülke Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="country.name" :value="country.name" type="text" name="name" required
                  placeholder="Ülke Adını Yazın" />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="iso" class="flex flex-col w-full sm:flex-row">
                  ISO
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="iso" v-model="country.iso" :value="country.iso" type="text" name="iso" required
                  placeholder="Ülke ISO Kodunu Yazın" />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="phone_code" class="flex flex-col w-full sm:flex-row">
                  Telefon Kodu
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="phone_code" v-model="country.phone_code" :value="country.phone_code" type="text"
                  name="phone_code" required placeholder="Ülke Telefon Kodunu Yazın" />
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
      <div class="col-span-12 intro-y lg:col-span-7">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Şehirler</h2>
          </div>
          <div class="p-5">
            <div v-if="cities.length > 0" class="col-span-12 overflow-auto intro-y lg:overflow-visible">
              <Table class="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> Adı </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> İşlemler </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr v-for="(city, key) in cities" :key="key" class="intro-x">
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ city.id }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ city.name }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
                    >
                      <div class="flex items-center justify-center">
                        <span
                          class="flex items-center mr-3 w-20 cursor-pointer"
                          @click="() => router.push({ name: 'cities.edit', params: { cityId: city.id } })"
                        >
                          <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Düzenle
                        </span>
                        <span
                          class="flex items-center text-danger cursor-pointer"
                          @click="() => deleteCityWithModal(city.id)"
                        >
                          <Lucide icon="Trash2" class="w-4 h-4 mr-1" /> Sil
                        </span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div v-else>
              Henüz Şehir Oluşturulmamış
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

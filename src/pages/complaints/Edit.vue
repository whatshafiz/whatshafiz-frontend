<script setup lang="ts">
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, reactive, onBeforeMount, inject, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useComplaintsStore } from "@/stores/complaint"
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const complaintId = route.params.complaintId
const user = useUserStore()
const complaintStore = useComplaintsStore()
const complaint = ref({})

onBeforeMount(async () => {
  complaint.value = await complaintStore.fetchComplaint(complaintId)
})

const onSubmit = async () => {
  isLoading.value = true
  complaint.value.is_resolved = complaint.value.is_resolved === 'true'

  if (await complaintStore.updateComplaint(complaintId, complaint.value)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Şikayet Bilgileri Güncellendi.')
    router.go(-1)
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('complaints.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Şikayet Düzenleme</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Şikayet Bilgileri</h2>
          </div>
          <div class="p-5" v-if="complaint.id">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel htmlFor="created_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet Eden
                </FormLabel>
                <div class="flex flex-col items-center p-2 lg:flex-row">
                  <div class="w-12 h-12 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="Şikayet Eden Kullanıcı"
                      class="rounded-full"
                      :src="complaint.created_user.gender === 'male' ?
                        maleProfile :
                        (complaint.created_user.gender === 'female' ? femaleProfile : userProfile)"
                    />
                  </div>
                  <div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="" class="font-medium">
                      {{ complaint.created_user.name }} {{ complaint.created_user.surname }}
                    </a>
                    <div class="text-slate-500 text-xs mt-0.5">{{ complaint.created_user.university_name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ complaint.created_user.city_name }} {{ complaint.created_user.country_name }}
                    </div>
                  </div>
                  <div class="flex mt-4 lg:mt-0">
                    <Button type="button" variant="primary" class="px-2 py-1 mr-2"> Mesaj Gönder </Button>
                    <Button type="button" variant="outline-secondary" class="px-2 py-1"> Profil </Button>
                  </div>
                </div>
              </div>
              <div class="input-form mt-4" v-if="complaint.related_user">
                <FormLabel htmlFor="related_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet Edilen
                </FormLabel>
                <div class="flex flex-col items-center p-2 lg:flex-row">
                  <div class="w-12 h-12 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="Şikayet Eden Kullanıcı"
                      class="rounded-full"
                      :src="complaint.related_user.gender === 'male' ?
                        maleProfile :
                        (complaint.related_user.gender === 'female' ? femaleProfile : userProfile)"
                    />
                  </div>
                  <div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="" class="font-medium">
                      {{ complaint.related_user.name }} {{ complaint.related_user.surname }}
                    </a>
                    <div class="text-slate-500 text-xs mt-0.5">{{ complaint.related_user.university_name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ complaint.related_user.city_name }} {{ complaint.related_user.country_name }}
                    </div>
                  </div>
                  <div class="flex mt-4 lg:mt-0">
                    <Button type="button" variant="primary" class="px-2 py-1 mr-2"> Mesaj Gönder </Button>
                    <Button type="button" variant="outline-secondary" class="px-2 py-1"> Profil </Button>
                  </div>
                </div>
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="subject" class="flex flex-col w-full sm:flex-row">
                  Şikayet Konusu
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="subject"
                  v-model="complaint.subject"
                  :value="complaint.subject"
                  type="text"
                  name="subject"
                  required
                  placeholder="Şikayet Konusunu Yazın"
                />
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="description" class="flex flex-col w-full sm:flex-row">
                  Şikayet Açıklaması
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormTextarea
                  id="description"
                  v-model="complaint.description"
                  :value="complaint.description"
                  type="text"
                  name="description"
                  required
                  placeholder="Şikayet Açıklamanızı Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="result" class="flex flex-col w-full sm:flex-row">
                  Sonuç
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormTextarea
                  id="result"
                  v-model="complaint.result"
                  :value="complaint.result"
                  type="text"
                  name="result"
                  required
                  placeholder="Şikayet Sonucunu Yazın"
                />
              </div>
              <div class="input-form mt-4" v-if="complaint.id">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Şikayetin Durumu
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="complaint.is_resolved"
                  :options="{
                    placeholder: 'Şikayetin durumunu seçin.',
                  }"
                  class="w-full"
                >
                  <option :value="false"> Çözüm Bekliyor </option>
                  <option :value="true"> Çözüldü </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5" v-if="complaint.reviewed_user">
                <FormLabel htmlFor="reviewed_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet İle En Son İlgilenen
                </FormLabel>
                <div class="flex flex-col items-center p-2 lg:flex-row">
                  <div class="w-12 h-12 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="Şikayet Eden Kullanıcı"
                      class="rounded-full"
                      :src="complaint.reviewed_user.gender === 'male' ?
                        maleProfile :
                        (complaint.reviewed_user.gender === 'female' ? femaleProfile : userProfile)"
                    />
                  </div>
                  <div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="" class="font-medium">
                      {{ complaint.reviewed_user.name }} {{ complaint.reviewed_user.surname }}
                    </a>
                    <div class="text-slate-500 text-xs mt-0.5">{{ complaint.reviewed_user.university_name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ complaint.reviewed_user.city_name }} {{ complaint.reviewed_user.country_name }}
                    </div>
                  </div>
                  <div class="flex mt-4 lg:mt-0">
                    <Button type="button" variant="primary" class="px-2 py-1 mr-2"> Mesaj Gönder </Button>
                    <Button type="button" variant="outline-secondary" class="px-2 py-1"> Profil </Button>
                  </div>
                </div>
              </div>
              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <Button variant="outline-secondary" type="button" class="mt-5 mr-5" @click="() => router.go(-1)">
                İptal
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

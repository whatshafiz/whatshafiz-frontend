<script setup lang="ts">
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import TomSelect from '@/base-components/TomSelect'
import UserCard from '@/components/UserCard'
import { ref, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useComplaintsStore } from "@/stores/complaint"
import _ from "lodash";

const router = useRouter()
const route = useRoute()
const complaintId = route.params.complaintId
const user = useUserStore()
const complaintStore = useComplaintsStore()
const complaint = ref({})

onBeforeMount(async () => {
  complaint.value = await complaintStore.fetchComplaint(complaintId)
})
</script>

<template>
  <div v-if="user.can('complaints.view') || complaint.created_by === user.profile.id">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Şikayet Detayları</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Şikayet Bilgileri</h2>
          </div>
          <div class="p-5" v-if="complaint.id">
            <form class="validate-form">
              <div class="input-form">
                <FormLabel htmlFor="created_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet Eden
                </FormLabel>
                <user-card :user="complaint.created_user" />
              </div>
              <div class="input-form mt-4" v-if="complaint.related_user">
                <FormLabel htmlFor="related_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet Edilen
                </FormLabel>
                <user-card :user="complaint.related_user" />
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
                  type="text" name="subject"
                  disabled
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
                  disabled
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
                  disabled
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
                  class="w-full"
                  :options="{ placeholder: 'Şikayetin durumunu seçin.' }"
                  disabled
                >
                  <option :value="false"> Çözüm Bekliyor </option>
                  <option :value="true"> Çözüldü </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5" v-if="complaint.reviewed_user">
                <FormLabel htmlFor="reviewed_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet İle En Son İlgilenen
                </FormLabel>
                <user-card :user="complaint.reviewed_user" />
              </div>
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

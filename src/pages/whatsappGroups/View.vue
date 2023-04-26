<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import TomSelect from '@/base-components/TomSelect'
import Lucide from '@/base-components/Lucide'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useWhatsappGroupStore } from "@/stores/whatsappGroup"
import _ from "lodash";

const router = useRouter()
const route = useRoute()
const whatsappGroupId = route.params.whatsappGroupId
const user = useUserStore()
const whatsappGroupStore = useWhatsappGroupStore()
const whatsappGroup = ref({})

onBeforeMount(async () => {
  whatsappGroup.value = await whatsappGroupStore.fetchWhatsappGroup(whatsappGroupId)
})
</script>

<template>
  <div v-if="user.can('whatsappGroups.view')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Whatsapp Grubu Detayları</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Whatsapp Grup Bilgileri</h2>
          </div>
          <div class="p-5" v-if="whatsappGroup.id">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Kurs
                </FormLabel>
                <TomSelect
                  v-model="whatsappGroup.course_id"
                  :options="{ placeholder: 'Kurs seçin.' }"
                  disabled
                  class="w-full"
                >
                  <option :key="whatsappGroup.course.id" :value="whatsappGroup.course.id">
                      {{ whatsappGroup.course.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Eğitim Türü
                </FormLabel>
                <TomSelect
                  v-model="whatsappGroup.type"
                  :options="{ placeholder: 'Eğitim türü seçin.' }"
                  disabled
                  class="w-full"
                >
                  <option key="whatshafiz" value="whatshafiz"> WhatsHafız </option>
                  <option key="whatshafiz" value="whatsenglish"> WhatsEnglish </option>
                  <option key="whatshafiz" value="whatsarapp"> WhatsArapp </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Cinsiyet
                </FormLabel>
                <TomSelect
                  v-model="whatsappGroup.gender"
                  :options="{ placeholder: 'Cinsiyet seçin.' }"
                  disabled
                  class="w-full"
                >
                  <option key="whatshafiz" value="male"> Erkek </option>
                  <option key="whatshafiz" value="female"> Kadın </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Grup Adı
                </FormLabel>
                <FormInput
                  id="name"
                  v-model="whatsappGroup.name" :value="whatsappGroup.name"
                  type="text"
                  name="name"
                  required
                  disabled
                  placeholder="Grup Adını Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Grup Katılma Linki
                  <a class="flex items-center float-right text-success" target="_blank" :href="whatsappGroup.join_url">
                    <Lucide icon="ExternalLink" class="w-4 h-4 ml-2 mr-1" /> Katıl
                  </a>
                </FormLabel>
                <FormInput
                  id="join_url"
                  v-model="whatsappGroup.join_url"
                  :value="whatsappGroup.join_url"
                  type="text"
                  name="join_url"
                  disabled
                  required
                  placeholder="Grup katılma linkini buraya yapıştırın."
                />
              </div>
              <div class="mt-3">
                <label>Aktif Grup mu?</label>
                <div class="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      id="is_active"
                      type="checkbox"
                      name="is_active"
                      v-model="whatsappGroup.is_active"
                      disabled
                    />
                    <FormSwitch.Label htmlFor="is_active">
                      Aktif
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>
              <Button variant="outline-secondary" type="button" class="mt-5 mr-5" @click="() => router.go(-1)">
                Geri
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

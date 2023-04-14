<script setup lang="ts">
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, reactive, onBeforeMount, inject, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCommentsStore } from "@/stores/comment"
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const commentId = route.params.commentId
const user = useUserStore()
const commentStore = useCommentsStore()
const comment = ref({})

onBeforeMount(async () => {
  comment.value = await commentStore.fetchComment(commentId)
})
</script>

<template>
  <div v-if="user.can('comments.view')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yorum Detayları</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Yorum Detayları</h2>
          </div>
          <div class="p-5" v-if="comment.id">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel htmlFor="commented_by" class="flex flex-col w-full sm:flex-row">
                  Yorum Yapan
                </FormLabel>
                <div class="flex flex-col items-center p-2 lg:flex-row">
                  <div class="w-12 h-12 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="Yorum Yapan Kullanıcı"
                      class="rounded-full"
                      :src="comment.commented_by.gender === 'male' ?
                        maleProfile :
                        (comment.commented_by.gender === 'female' ? femaleProfile : userProfile)"
                    />
                  </div>
                  <div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="" class="font-medium">
                      {{ comment.commented_by.name }} {{ comment.commented_by.surname }}
                    </a>
                    <div class="text-slate-500 text-xs mt-0.5">{{ comment.commented_by.university_name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ comment.commented_by.city_name }} {{ comment.commented_by.country_name }}
                    </div>
                  </div>
                  <div class="flex mt-4 lg:mt-0">
                    <Button type="button" variant="primary" class="px-2 py-1 mr-2"> Mesaj Gönder </Button>
                    <Button type="button" variant="outline-secondary" class="px-2 py-1"> Profil </Button>
                  </div>
                </div>
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Yorum Yapılan Kurs Türü
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="comment.type"
                  :options="{ placeholder: 'Kurs türünü seçin.' }"
                  class="w-full"
                  disabled
                >
                  <option key="whatshafiz" value="whatshafiz"> WhatsHafız </option>
                  <option key="whatsenglish" value="whatsenglish"> WhatsEnglish </option>
                  <option key="whatsarapp" value="whatsarapp"> WhatsArapp </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="title" class="flex flex-col w-full sm:flex-row">
                  Yorum Başlığı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="title"
                  v-model="comment.title"
                  :value="comment.title"
                  type="text"
                  name="title"
                  disabled
                  placeholder="Yorum Başlığını Yazın"
                />
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="comment" class="flex flex-col w-full sm:flex-row">
                  Yorum Açıklaması
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormTextarea
                  id="comment"
                  v-model="comment.comment"
                  :value="comment.comment"
                  type="text"
                  name="comment"
                  disabled
                  placeholder="Yorumunuzu Yazın"
                />
              </div>
              <div class="input-form mt-4" v-if="comment.id">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Yorumun Durumu
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="comment.is_approved"
                  :options="{
                    placeholder: 'Yorumun durumunu seçin.',
                  }"
                  class="w-full"
                  disabled
                >
                  <option :value="false"> Onay Bekliyor </option>
                  <option :value="true"> Onaylı </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5" v-if="comment.approved_by">
                <FormLabel htmlFor="approved_by" class="flex flex-col w-full sm:flex-row">
                  Yorumu Onaylayan
                </FormLabel>
                <div class="flex flex-col items-center p-2 lg:flex-row">
                  <div class="w-12 h-12 lg:w-12 lg:h-12 image-fit lg:mr-1">
                    <img
                      alt="Yorum Eden Kullanıcı"
                      class="rounded-full"
                      :src="comment.approved_by.gender === 'male' ?
                        maleProfile :
                        (comment.approved_by.gender === 'female' ? femaleProfile : userProfile)"
                    />
                  </div>
                  <div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                    <a href="" class="font-medium">
                      {{ comment.approved_by.name }} {{ comment.approved_by.surname }}
                    </a>
                    <div class="text-slate-500 text-xs mt-0.5">{{ comment.approved_by.university_name }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ comment.approved_by.city_name }} {{ comment.approved_by.country_name }}
                    </div>
                  </div>
                  <div class="flex mt-4 lg:mt-0">
                    <Button type="button" variant="primary" class="px-2 py-1 mr-2"> Mesaj Gönder </Button>
                    <Button type="button" variant="outline-secondary" class="px-2 py-1"> Profil </Button>
                  </div>
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

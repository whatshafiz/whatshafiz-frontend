<script setup lang="ts">
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import UserCard from '@/components/UserCard'
import { ref, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCommentsStore } from "@/stores/comment"
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

const onSubmit = async () => {
  isLoading.value = true
  comment.value.is_approved = comment.value.is_approved === 'true'

  if (await commentStore.updateComment(commentId, comment.value)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Yorum Güncellendi.')
    router.go(-1)
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('comments.update') || (user.profile.id === comment.commented_by_id && !comment.is_approved)">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yorum Düzenleme</h2>
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
                <user-card :user="comment.commented_by" />
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
                  required
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
                  required
                  placeholder="Yorumunuzu Yazın"
                />
              </div>
              <div class="input-form mt-4" v-if="comment.id && user.can('comments.update')">
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
                >
                  <option :value="false"> Onay Bekliyor </option>
                  <option :value="true"> Onaylı </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5" v-if="comment.approved_by">
                <FormLabel htmlFor="approved_by" class="flex flex-col w-full sm:flex-row">
                  Yorumu Onaylayan
                </FormLabel>
                <user-card :user="comment.approved_by" />
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

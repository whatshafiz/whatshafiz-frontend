<script
  setup
  lang="ts"
>
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import TomSelect from '@/base-components/TomSelect'
import UserCard from '@/components/UserCard'
import { ref, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCommentsStore } from "@/stores/comment"
import { useCourseTypeStore } from "@/stores/courseType"
import _ from "lodash";

const router = useRouter()
const route = useRoute()
const commentId = route.params.commentId
const user = useUserStore()
const commentStore = useCommentsStore()
const comment = ref({})
const courseTypeStore = useCourseTypeStore()
const courseTypes = ref([])

onBeforeMount(async () => {
  courseTypes.value = (await courseTypeStore.fetchCourseTypes()).filter(courseType => courseType.parent_id !== null)
  comment.value = await commentStore.fetchComment(commentId)
})
</script>

<template>
  <div>
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yorum Detayları</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Yorum Detayları</h2>
          </div>
          <div
            class="p-5"
            v-if="comment.id"
          >
            <form
              class="validate-form"
              @submit.prevent="onSubmit"
            >
              <div class="input-form">
                <FormLabel
                  htmlFor="commented_by"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Yorum Yapan
                </FormLabel>
                <user-card :user="comment.commented_by" />
              </div>
              <div class="input-form mt-5">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Yorum Yapılan Kurs Türü
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="comment.course_type_id"
                  :options="{ placeholder: 'Kurs türünü seçin.' }"
                  class="w-full"
                  disabled
                >
                  <option
                    v-for="(courseType, key) in courseTypes"
                    :key="key"
                    :value="courseType.id"
                  >
                    {{ courseType.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5">
                <FormLabel
                  htmlFor="title"
                  class="flex flex-col w-full sm:flex-row"
                >
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
                <FormLabel
                  htmlFor="comment"
                  class="flex flex-col w-full sm:flex-row"
                >
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
              <div
                class="input-form mt-4"
                v-if="comment.id"
              >
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
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
              <div
                class="input-form mt-5"
                v-if="comment.approved_by"
              >
                <FormLabel
                  htmlFor="approved_by"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Yorumu Onaylayan
                </FormLabel>
                <user-card :user="comment.approved_by" />
              </div>
              <Button
                variant="outline-secondary"
                type="button"
                class="mt-5 mr-5"
                @click="() => router.go(-1)"
              >
                Geri
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import { ref, reactive, inject, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { useCommentsStore } from "@/stores/comment"
import { useCourseTypeStore } from "@/stores/courseType"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const commentStore = useCommentsStore()
const courseTypeStore = useCourseTypeStore()
const courseTypes = ref([])
const comment = reactive({
  type: '',
  title: '',
  comment: '',
})

onBeforeMount(async () => {
  courseTypes.value = (await courseTypeStore.fetchCourseTypes()).filter(courseType => courseType.parent_id !== null)
})

const onSubmit = async () => {
  isLoading.value = true

  if (await commentStore.createComment(comment)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Yorumunuz Kaydedildi.')
    router.go(-1)
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Yorum Oluşturma</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Yorum Detayları</h2>
          </div>
          <div class="p-5">
            <form
              class="validate-form"
              @submit.prevent="onSubmit"
            >
              <div class="input-form">
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
                  required
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
                  required
                  placeholder="Yorumunuzu Yazın"
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                class="w-1/2 mt-5 mr-2"
                :disabled="isLoading"
              >
                <LoadingIcon
                  v-show="isLoading"
                  icon="oval"
                  color="white"
                  class="w-4 h-4 mr-5"
                />
                Kaydet
              </Button>
              <Button
                variant="outline-secondary"
                type="button"
                class="mt-5 mr-5"
                @click="() => router.go(-1)"
              >
                İptal
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

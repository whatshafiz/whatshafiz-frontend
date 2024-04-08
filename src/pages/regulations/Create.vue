<script
  setup
  lang="ts"
>
import { FormLabel, FormInput, FormSwitch, FormCheck } from "@/base-components/Form"
import Button from '@/base-components/Button/Button.vue';
import ClassicEditor from '@/base-components/Ckeditor/ClassicEditor.vue';
import { useRegulationStore } from '@/stores/regulation';
import { inject, onBeforeMount, ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { useCourseTypeStore } from "@/stores/courseType"
import { useUserStore } from '@/stores/user';
import LoadingIcon from '@/base-components/LoadingIcon';
import Preview from '@/base-components/Preview';
import TomSelect from '@/base-components/TomSelect'
import _ from 'lodash'

const successNotificationToggle: any = inject('successNotificationToggle')
const errorNotificationToggle: any = inject('errorNotificationToggle')
const route = useRoute()
const alert = useAlertStore()
const router = useRouter()
const user = useUserStore()
const isLoading = ref(false)
const courseTypeStore = useCourseTypeStore()
const courseTypes = ref([])
const regulationStore = useRegulationStore()
const regulation = reactive({
  'course_type_id': '',
  'name': '',
  'slug': '',
  'summary': '',
  'text': '',
})

onBeforeMount(async () => {
  courseTypes.value = (await courseTypeStore.fetchCourseTypes()).filter(courseType => courseType.regulation === null)
})

watch(() => regulation.course_type_id, (newValue) => {
  regulation.name = courseTypes.value.find(courseType => courseType.id == newValue).name + ' Yönetmeliği'
  regulation.slug = _.kebabCase(regulation.name)
});

const onSubmit = async () => {
  isLoading.value = true

  if (await regulationStore.createRegulation(regulation)) {
    successNotificationToggle('İşlem Başarılı', 'Yönetmelik Oluşturuldu.')
    isLoading.value = false
    router.push({ name: 'regulations.index' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
    errorNotificationToggle('Hata Oluştu.', 'Yönetmelik oluştururken bir hata oluştu!')
  }
}
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Yeni Yönetmelik Oluştur</h2>
  </div>
  <div
    v-if="user.can('regulations.create')"
    class="overflow-x-auto"
  >
    <Preview class="mt-5 intro-y box h-min sm:w-full md:w-2/3">
      <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60">
        <h2 class="mr-auto text-base font-medium">Yönetmelik Bilgileri</h2>
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
              Kurs Türü
              <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Zorunlu
              </span>
            </FormLabel>
            <TomSelect
              v-model="regulation.course_type_id"
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
              htmlFor="name"
              class="flex flex-col w-full sm:flex-row"
            >
              Yönetmelik Adı
              <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Zorunlu
              </span>
            </FormLabel>
            <FormInput
              id="name"
              v-model="regulation.name"
              :value="regulation.name"
              type="text"
              name="name"
              required
              placeholder="Yönetmelik Adını Yazın"
            />
          </div>
          <div class="input-form mt-5">
            <FormLabel
              htmlFor="slug"
              class="flex flex-col w-full sm:flex-row"
            >
              Kurs Türü Slug
              <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Zorunlu
              </span>
            </FormLabel>
            <FormInput
              id="slug"
              v-model="regulation.slug"
              :value="regulation.slug"
              type="text"
              name="slug"
              required
              placeholder="Kurs Türü Slug Yazın"
            />
          </div>
          <div class="input-form mt-4">
            <Preview.Panel>
              <div class="overflow-x-auto">
                <div class="flex items-center mb-4">
                  <div class="text-lg font-medium">Özet</div>
                </div>
                <ClassicEditor v-model="regulation.summary" />
                <div class="flex items-center mt-5 mb-4">
                  <div class="text-lg font-medium">Yönetmelik</div>
                </div>
                <ClassicEditor
                  v-model="regulation.text"
                  :value="regulation.text"
                />
                <div class="flex gap-3 m-5 justify-end">
                  <Button
                    variant="primary"
                    class="w-24 mb-2 mr-1 "
                    @click="() => onSubmit()"
                    :disabled="isLoading"
                  >
                    <LoadingIcon
                      v-show="isLoading"
                      icon="oval"
                      color="white"
                      class="w-4 h-4 mr-1 "
                    />
                    Kaydet
                  </Button>
                  <RouterLink :to="{ name: 'regulations.index' }">
                    <Button
                      variant="outline-primary"
                      class="w-24 mb-2 mr-1"
                    >
                      Geri
                    </Button>
                  </RouterLink>
                </div>
              </div>
            </Preview.Panel>
          </div>
        </form>
      </div>
    </Preview>
  </div>
</template>

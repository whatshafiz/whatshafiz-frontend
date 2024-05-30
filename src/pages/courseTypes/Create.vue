<script
  setup
  lang="ts"
>
import { FormLabel, FormInput, FormSwitch, FormCheck } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import { ref, reactive, onBeforeMount, inject, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCourseTypeStore } from "@/stores/courseType"
import { useEducationLevelStore } from "@/stores/educationLevel"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const courseTypeStore = useCourseTypeStore()
const mainCourseTypes = ref([])
const educationLevelStore = useEducationLevelStore()
const educationLevels = ref([])
const courseType = reactive({
  parent_id: null,
  name: '',
  slug: '',
  is_active: true,
  has_admission_exam: false,
  min_age: 12,
  genders: [],
  education_levels: [],
})

onBeforeMount(async () => {
  mainCourseTypes.value = (await courseTypeStore.fetchCourseTypes()).filter(courseType => courseType.parent_id === null)
  educationLevels.value = (await educationLevelStore.fetchEducationLevels())
})

watch(() => courseType.name, (newValue) => {
  courseType.slug = _.camelCase(newValue)
});

const onSubmit = async () => {
  isLoading.value = true

  if (await courseTypeStore.createCourseType(courseType)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Yeni Kurs Türü Oluşturuldu.')
    router.push({ name: 'courseTypes.index' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('courseTypes.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Kurs Türü Oluştur</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Kurs Türü Bilgileri</h2>
          </div>
          <div class="p-5">
            <form
              class="validate-form"
              @submit.prevent="onSubmit"
            >
              <div
                class="input-form"
                v-if="mainCourseTypes.length > 0"
              >
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Ait Olduğu Ana Kurs Türü
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    (Ana kurs türü oluşturmak için boş bırakın.)
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="courseType.parent_id"
                  :options="{ placeholder: 'Ana Kurs Türü seçin.' }"
                  class="w-full"
                >
                  <option
                    v-for="mainCourseType in mainCourseTypes"
                    :key="mainCourseType.id"
                    :value="mainCourseType.id"
                  >
                    {{ mainCourseType.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-5">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Kurs Türü Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="name"
                  v-model="courseType.name"
                  :value="courseType.name"
                  type="text"
                  name="name"
                  required
                  placeholder="Kurs Türü Adını Yazın"
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
                  v-model="courseType.slug"
                  :value="courseType.slug"
                  type="text"
                  name="slug"
                  required
                  placeholder="Kurs Türü Slug Yazın"
                />
              </div>
              <div class="mt-5">
                <label>Aktif Kurs Türü mü?</label>
                <div class="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      id="is_active"
                      type="checkbox"
                      name="is_active"
                      v-model="courseType.is_active"
                    />
                    <FormSwitch.Label htmlFor="is_active">
                      Aktif
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>
              <div class="mt-5">
                <label>Kurslara Kabul Sınavı Yapılacak mı?</label>
                <div class="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      id="has_admission_exam"
                      type="checkbox"
                      name="has_admission_exam"
                      v-model="courseType.has_admission_exam"
                    />
                    <FormSwitch.Label htmlFor="has_admission_exam">
                      Evet
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>
              <div class="input-form mt-5">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Kurslara Katılım İçin En Küçük Yaş Nedir?
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="min_age"
                  v-model="courseType.min_age"
                  :value="courseType.min_age"
                  type="text"
                  name="min_age"
                  required
                  placeholder="Kurs Türü İçin Minimum Yaş Yazın"
                />
              </div>
              <div class="mt-5">
                <label>Kurslara Katılabilecek Cinsiyetler</label>
                <div class="flex flex-col mt-2 sm:flex-row">
                  <FormCheck class="mr-10">
                    <input
                      name="genders"
                      id="genders-male"
                      type="checkbox"
                      v-model="courseType.genders"
                      value="male"
                    />
                    <FormCheck.Label htmlFor="genders-male">
                      Bay
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck class="mt-2 mr-2 sm:mt-0">
                    <input
                      name="genders"
                      id="genders-female"
                      type="checkbox"
                      v-model="courseType.genders"
                      value="female"
                    />
                    <FormCheck.Label htmlFor="genders-female">
                      Bayan
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>
              <div class="mt-5">
                <label>Kurslara Katılabilecek Eğitim Seviyeleri</label>
                <div
                  v-for="(educationLevel, key) in educationLevels"
                  :key="key"
                >
                  <FormCheck class="mt-3">
                    <input
                      :id="'education-level-' + key"
                      type="checkbox"
                      name="education_levels"
                      :value="educationLevel.name"
                      v-model="courseType.education_levels"
                    />
                    <FormCheck.Label :htmlFor="'education-level-' + key">
                      {{ educationLevel.name }}
                    </FormCheck.Label>
                  </FormCheck>
                </div>
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

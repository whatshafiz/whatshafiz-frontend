<script setup lang="ts">
import Button from '@/base-components/Button/Button.vue';
import ClassicEditor from '@/base-components/Ckeditor/ClassicEditor.vue';
import { useRegulationStore } from '@/stores/regulation';
import { inject, onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { useUserStore } from '@/stores/user';
import LoadingIcon from '@/base-components/LoadingIcon';
import Preview from '@/base-components/Preview';

const successNotificationToggle: any = inject('successNotificationToggle')
const route = useRoute()
const alert = useAlertStore()
const router = useRouter()
const user = useUserStore()
const isLoading = ref(false)
const regulationStore = useRegulationStore()
const regulationSlug = ref('')
const regulation = ref({})

onBeforeMount(async () => {
  regulationSlug.value = route.params.regulation
  regulation.value = await regulationStore.fetchRegulation(regulationSlug.value)

  if (regulation.value.summary === null) {
    regulation.value.summary = ''
  }
})

const onSubmit = async () => {
  isLoading.value = true

  try {
    await regulationStore.updateRegulation(regulationSlug.value, regulation.value)
    successNotificationToggle('İşlem Başarılı', regulation.value.name + ' Yönetmeliği Güncellendi')
    isLoading.value = false
    router.push({ name: 'regulations.index' })
  }
  catch (error) {
    alert.addErrorMessage("Yönetmelik güncellenemedi")
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Yönetmelik Güncelleme</h2>
  </div>
  <div v-if="user.can('regulations.update')" class="overflow-x-auto">
    <Preview class="mt-5 intro-y box h-min sm:w-full md:w-2/3">
      <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60">
        <h2 class="mr-auto text-base font-medium">{{ regulation.name }} Yönetmeliği Güncelle</h2>
      </div>
      <div class="p-5" v-if="regulation.name">
        <Preview.Panel>
          <div class="overflow-x-auto">
            <div class="flex items-center mb-4">
              <div class="text-lg font-medium">Özet</div>
            </div>
            <ClassicEditor v-model="regulation.summary" />
            <div class="flex items-center mt-5 mb-4">
              <div class="text-lg font-medium">Yönetmelik</div>
            </div>
            <ClassicEditor v-model="regulation.text" :value="regulation.text" />
            <div class="flex gap-3 m-5 justify-end">
              <Button variant="primary" class="w-24 mb-2 mr-1 " @click="() => onSubmit()" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-1 " />
                Güncelle
              </Button>
              <RouterLink :to="{ name: 'regulations.index' }">
                <Button variant="outline-primary" class="w-24 mb-2 mr-1">
                  Geri
                </Button>
              </RouterLink>
            </div>
          </div>
        </Preview.Panel>
      </div>
    </Preview>
  </div>
</template>

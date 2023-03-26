<script setup lang="ts">
import Button from '@/base-components/Button/Button.vue';
import ClassicEditor from '@/base-components/Ckeditor/ClassicEditor.vue';
import { useRegulationsStore } from '@/stores/regulations';
import { inject, onBeforeMount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { useUserStore } from '@/stores/user';
import LoadingIcon from '@/base-components/LoadingIcon';
import Preview from '@/base-components/Preview';

const successNotificationToggle: any = inject('successNotificationToggle')
const route = useRoute()
const alert = useAlertStore()

const user = useUserStore()
const isLoading = ref(true)
const isLoadingSubmit = ref(false)
const regulationSummary = ref('')
const regulationStore = useRegulationsStore()
const regulation = ref()

onBeforeMount(async () => {
  try {
    const regulationData = await regulationStore.fetchRegulation(route.params.slug as string)
    regulation.value = regulationData
    regulationSummary.value = regulation.value.summary ?? ''
    isLoading.value = false
  }
  catch (error) {
    isLoading.value = false
    alert.addErrorMessage("Yönetmelik alınamadı")
  }
})

const update = async () => {
  isLoadingSubmit.value = true
  const dataToUpdate = new FormData()
  dataToUpdate.append('summary', regulationSummary.value)
  dataToUpdate.append('text', regulation.value.text)
  try {
    await regulationStore.updateRegulation(route.params.slug as string, dataToUpdate)
    successNotificationToggle('İşlem Başarılı', 'Yönetmelik güncellendi')
  }
  catch (error) {
    alert.addErrorMessage("Yönetmelik güncellenemedi")
  }
  isLoadingSubmit.value = false
}
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
  </div>
  <div v-if="!isLoading && user.can('regulations.update')" class="overflow-x-auto">
    <Preview class="mt-5 intro-y box h-min sm:w-full md:w-2/3">
      <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60">
        <h2 class="mr-auto text-base font-medium">{{ regulation.name }}</h2>
      </div>
      <div class="p-5">
        <Preview.Panel>
          <div class="overflow-x-auto">
            <div class="flex items-center mb-4">
              <div class="text-lg font-medium">Özet</div>
            </div>
            <ClassicEditor v-model="regulationSummary" />
            <div class="flex items-center mt-5 mb-4">
              <div class="text-lg font-medium">Yönetmelik</div>
            </div>
            <ClassicEditor v-model="regulation.text" />
            <div class="flex gap-3 m-5 justify-end">
              <Button variant="primary" class="w-24 mb-2 mr-1 " @click="() => update()" :disabled="isLoadingSubmit">
                <LoadingIcon v-show="isLoadingSubmit" icon="oval" color="white" class="w-4 h-4 mr-1 " />
                Güncelle
              </Button>
              <RouterLink :to="{ name: 'regulations.list' }">
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

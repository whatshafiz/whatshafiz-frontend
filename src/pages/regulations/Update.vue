<script setup lang="ts">
import Button from '@/base-components/Button/Button.vue';
import ClassicEditor from '@/base-components/Ckeditor/ClassicEditor.vue';
import { useRegulationsStore } from '@/stores/regulations';
import { inject, onBeforeMount, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAlertStore } from '@/stores/alert';
import { useUserStore } from '@/stores/user';

const successNotificationToggle: any = inject('successNotificationToggle')
const route = useRoute()
const alert = useAlertStore()

const user = useUserStore()
const isLoading = ref(true)
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
    const dataToUpdate = new FormData()
    dataToUpdate.append('summary', regulationSummary.value)
    dataToUpdate.append('text', regulation.value.text)
    try {
        await regulationStore.updateRegulation(route.params.slug as string, dataToUpdate)
        isLoading.value = false
        successNotificationToggle('İşlem Başarılı', 'Yönetmelik güncellendi')
    }
    catch (error) {
        alert.addErrorMessage("Yönetmelik güncellenemedi")
    }
}
</script>

<template>
    <div class="w-1/2 h-screen" v-if="!isLoading && user.can('regulations.update')">

        <div class="flex items-center mt-5">
            <div class="text-lg font-medium">Özet</div>
        </div>
        <ClassicEditor v-model="regulationSummary" />
        <div class="flex items-center mt-5">
            <div class="text-lg font-medium">Yönetmelik</div>
        </div>
        <ClassicEditor v-model="regulation.text" />
        <div class="flex gap-3 m-5 justify-end">
            <Button variant="primary" class="w-24 mb-2 mr-1" @click="() => update()">
                Güncelle
            </Button>
            <RouterLink :to="{ name: 'regulations.list' }">
                <Button variant="secondary" class="w-24 mb-2 mr-1">
                    Geri
                </Button>
            </RouterLink>
        </div>
    </div>
</template>

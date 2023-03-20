<script setup lang="ts">
import Alert from '@/base-components/Alert/Alert.vue';
import Button from '@/base-components/Button/Button.vue';
import ClassicEditor from '@/base-components/Ckeditor/ClassicEditor.vue';
import LoadingIcon from '@/base-components/LoadingIcon/LoadingIcon.vue';
import Lucide from '@/base-components/Lucide/Lucide.vue';
import { useRegulationsStore } from '@/stores/regulations';
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const loaded = ref(false)
const route = useRoute()
const router = useRouter()
const regulationSummary = ref('')
const regulationStore = useRegulationsStore()
const regulation = ref({})
const errorMessage = ref('')

onBeforeMount(async () => {
    const regulationData = await regulationStore.fetchRegulation(route.params.slug)
    regulation.value = regulationData
    regulationSummary.value = regulation.summary ?? ''
    loaded.value = true
})

const update = () => {
    try {
        const dataToUpdate = new FormData()
        dataToUpdate.append('summary', regulationSummary.value)
        dataToUpdate.append('text', regulation.value.text)
        regulationStore.updateRegulation(route.params.slug, dataToUpdate)
    } catch (err: string) {
        errorMessage.value = err
    }
}
</script>

<template>
    <template v-if="loaded">

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
        <div class="mt-4 transition-all linear duration-[400ms]" v-if="errorMessage">
            <Alert variant="soft-danger" class="flex items-center mb-2">
                <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
                {{ errorMessage }}
            </Alert>
        </div>
    </template>
    <div v-else class="flex items-center justify-end">
        <LoadingIcon icon="oval" color="black" class="w-16 h-16" />
    </div>
</template>

<script setup lang="ts">
import Button from "@/base-components/Button";
import { useRegulationsStore } from "@/stores/regulations"
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useAlertStore } from "@/stores/alert";

const route = useRoute()
const regulationsStore = useRegulationsStore()
const alert = useAlertStore()

const regulation = ref({})
const isLoading = ref(true)
onBeforeMount(async () => {
    try {
        const regulationData = await regulationsStore.fetchRegulation(route.params.slug as string)
        regulation.value = regulationData
        isLoading.value = false
    }
    catch (error) {
        isLoading.value = false
        alert.addErrorMessage('Yönetmelik görüntülenemedi')
    }
})
</script>

<template>
    <div class="w-1/2 h-screen" v-if="!isLoading">
        <div class="flex items-center" v-if="regulation.summary">
            <div class="text-lg font-medium">Özet </div>
        </div>
        <div class="mt-4" v-html="regulation.summary"></div>
        <div class="p-5 mt-5 text-white intro-y box bg-primary">
            <div class="flex items-center">
                <div class="text-lg font-medium">Yönetmelik Metni</div>
            </div>
            <div class="mt-4" v-html="regulation.text"></div>
        </div>
        <div class="flex gap-3 m-5 justify-end">
            <RouterLink :to="{ name: 'regulations.list' }">
                <Button variant="primary" class="w-24 mb-2 mr-1">
                    Geri
                </Button>
            </RouterLink>
        </div>
    </div>
</template>
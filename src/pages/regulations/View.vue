<script setup lang="ts">
import Button from "@/base-components/Button";
import LoadingIcon from "@/base-components/LoadingIcon/LoadingIcon.vue";
import { useRegulationsStore } from "@/stores/regulations"
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()
const loaded = ref(false)

const regulationsStore = useRegulationsStore()
const regulation = ref({})

onBeforeMount(async () => {
    const regulationData = await regulationsStore.fetchRegulation(route.params.slug)
    regulation.value = regulationData
    loaded.value = true
})
</script>

<template>
    <template v-if="loaded">
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
    </template>

    <div v-else class="flex items-center justify-end">
        <LoadingIcon icon="oval" color="black" class="w-16 h-16" />
    </div>
</template>x
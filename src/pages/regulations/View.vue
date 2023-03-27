<script setup lang="ts">
import Button from "@/base-components/Button";
import { useRegulationsStore } from "@/stores/regulations"
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { useAlertStore } from "@/stores/alert";
import { useUserStore } from "@/stores/user";
import Preview from "@/base-components/Preview";

const route = useRoute()
const user = useUserStore()
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
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
    </div>
    <div v-if="!isLoading && user.can('regulations.view')" class="overflow-x-auto">
        <Preview class="mt-5 box h-1/2 sm:w-full md:w-1/2">
            <div class="p-5 border-b sm:flex-row border-slate-200/60">
                <h2 class="mr-auto text-base font-medium">{{ regulation.name }}</h2>
            </div>
            <div class="p-5">
                <Preview.Panel>
                    <div class="overflow-x-auto flex flex-col gap-10">
                        <div v-if="regulation.summary" class="flex flex-col gap-4">
                            <div class="text-lg font-medium">Özet</div>
                            <div class="box gap-6 border-2 border-primary h-min p-6 dark:border-white">
                                <div class="" v-html="regulation.summary"></div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div class="text-lg font-medium">Yönetmelik</div>
                            <div class="box border-2 border-primary h-min p-6 dark:border-white">
                                <div class="" v-html="regulation.text"></div>
                            </div>
                        </div>
                        <div class="flex gap-3 m-5 justify-end">
                            <RouterLink :to="{ name: 'regulations.list' }">
                                <Button variant="primary" class="w-24 mb-2 mr-1">
                                    Geri
                                </Button>
                            </RouterLink>
                        </div>
                    </div>
                </Preview.Panel>
            </div>
        </Preview>
    </div>
    <div v-else class="text-center m-auto w-1/12">
        <LoadingIcon icon="oval" color="white" class="w-full" />
    </div>
</template>

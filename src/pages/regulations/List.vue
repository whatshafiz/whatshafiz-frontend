<script setup lang="ts">
import Table from "@/base-components/Table/Table.vue"
import Thead from "@/base-components/Table/Thead.vue";
import Tbody from "@/base-components/Table/Tbody.vue";
import Tr from "@/base-components/Table/Tr.vue";
import Td from "@/base-components/Table/Td.vue";
import Th from "@/base-components/Table/Th.vue";
import { useRegulationsStore } from '@/stores/regulations';
import { computed, onBeforeMount, ref } from 'vue';
import { useAlertStore } from "@/stores/alert";
import Lucide from "@/base-components/Lucide/Lucide.vue";

const regulationsStore = useRegulationsStore()
const alert = useAlertStore()

const isLoading = ref(true)

onBeforeMount(async () => {
    try {
        await regulationsStore.fetchRegulations()
        isLoading.value = false
    }
    catch (error) {
        isLoading.value = false
        alert.addErrorMessage('Yönetmelikler listelenemedi')

    }
})
const regulations = computed(() => {
    return regulationsStore.getRegulations
})
</script>

<template>
    <div class="h-screen">
        <div class="flex items-center mt-8 intro-y">
            <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
        </div>
        <div v-if="!isLoading" class="overflow-x-auto w-1/2">
            <Table class="my-5">
                <Thead variant="dark">
                    <Tr>
                        <Th class="whitespace-nowrap">
                            Program Adı
                        </Th>
                        <Th class="whitespace-nowrap text-center"> İşlem </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr v-for="regulation in regulations" :key="regulation.slug">
                        <Td>{{ regulation.name }}</Td>
                        <Td class="flex justify-center">
                            <RouterLink :to="{ name: 'regulations.update', params: { slug: regulation.slug } }">
                                <button class="flex">
                                    <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Düzenle
                                </button>
                            </RouterLink>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </div>
    </div>
</template>

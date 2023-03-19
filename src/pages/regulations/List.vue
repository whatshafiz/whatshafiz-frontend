<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
    </div>
    <div class="overflow-x-auto">
        <Table class="my-5">
            <Thead variant="dark">
                <Tr>
                    <Th class="whitespace-nowrap">
                        Program Adı
                    </Th>
                    <Th class="whitespace-nowrap"> İşlem </Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr v-for="regulation in regulations" :key="regulation.slug">
                    <Td>{{ regulation.name }}</Td>
                    <RouterLink :to="{ name: 'regulations.update', params: { slug: regulation.slug } }">
                        <Td>Düzenle</Td>
                    </RouterLink>
                </Tr>
            </Tbody>
        </Table>
    </div>
</template>

<script setup lang="ts">
import Table from "@/base-components/Table/Table.vue"
import Thead from "@/base-components/Table/Thead.vue";
import Tbody from "@/base-components/Table/Tbody.vue";
import Tr from "@/base-components/Table/Tr.vue";
import Td from "@/base-components/Table/Td.vue";
import Th from "@/base-components/Table/Th.vue";
import { useRegulationsStore } from '@/stores/regulations';
import { computed, onBeforeMount, ref } from 'vue';
const regulationsStore = useRegulationsStore()
const loaded = ref(false)
onBeforeMount(async () => {
    await regulationsStore.fetchRegulations()
    loaded.value = true
})
const regulations = computed(() => {
    return regulationsStore.getRegulations
})
</script>
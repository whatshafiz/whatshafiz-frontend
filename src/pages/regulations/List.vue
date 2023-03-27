<script setup lang="ts">
import Table from "@/base-components/Table"
import { useRegulationsStore } from '@/stores/regulations'
import Preview from "@/base-components/Preview"
import { computed, onBeforeMount, ref } from 'vue';
import { useAlertStore } from "@/stores/alert";
import Lucide from "@/base-components/Lucide/Lucide.vue";
import { useUserStore } from "@/stores/user";

const regulationsStore = useRegulationsStore()
const alert = useAlertStore()
const user = useUserStore()

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
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
  </div>
  <div v-if="!isLoading" class="overflow-x-auto">
    <Preview class="mt-5 intro-y box h-min sm:w-full md:w-2/3">
      <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60">
        <h2 class="mr-auto text-base font-medium">Yönetmelikler</h2>
      </div>
      <div class="p-5">
        <Preview.Panel>
          <div class="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th class="whitespace-nowrap">Yönetmelik</Table.Th>
                  <Table.Th class="whitespace-nowrap">İşlem</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr v-for="regulation in regulations" :key="regulation.slug">
                  <Table.Td class="whitespace-nowrap">{{ regulation.name }}</Table.Td>
                  <Table.Td v-if="user.can('regulations.update')" class="whitespace-nowrap">
                    <RouterLink :to="{ name: 'regulations.update', params: { slug: regulation.slug } }">
                      <button class="flex">
                        <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Düzenle
                      </button>
                    </RouterLink>
                  </Table.Td>
                  <Table.Td v-else-if="user.can('regulations.view')" class="whitespace-nowrap">
                    <RouterLink :to="{ name: 'regulations.view', params: { slug: regulation.slug } }">
                      <button class="flex">
                        <Lucide icon="Eye" class="w-4 h-4 mr-2" /> Görüntüle
                      </button>
                    </RouterLink>
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </Preview.Panel>
      </div>
    </Preview>
  </div>
  <div v-else class="text-center m-auto w-1/12">
    <LoadingIcon icon="oval" color="white" class="w-full" />
  </div>
</template>

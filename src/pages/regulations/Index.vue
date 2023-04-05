<script setup lang="ts">
import Table from "@/base-components/Table"
import { onBeforeMount, ref } from 'vue'
import Lucide from "@/base-components/Lucide"
import { useRouter } from "vue-router"
import { useRegulationStore } from "@/stores/regulation"
import { useUserStore } from "@/stores/user"

const regulationStore = useRegulationStore()
const user = useUserStore()
const router = useRouter()
const regulations = ref([])

onBeforeMount(async () => {
  regulations.value = await regulationStore.fetchRegulations()
})
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-12 intro-y lg:col-span-6">
      <div class="intro-y box">
        <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
          <h2 class="mr-auto text-base font-medium">Yönetmelik Listesi</h2>
        </div>
        <div class="p-5">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th class="whitespace-nowrap">Yönetmelik</Table.Th>
                <Table.Th class="whitespace-nowrap text-center">İşlemler</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr v-for="regulation in regulations" :key="regulation.slug">
                <Table.Td class="whitespace-nowrap">{{ regulation.name }}</Table.Td>
                <Table.Td class="whitespace-nowrap flex items-center lg:justify-center">
                  <div class="flex items-center justify-center">
                    <span class="flex items-center text-primary cursor-pointer"
                      @click="() => router.push({ name: 'regulations.view', params: { regulation: regulation.slug } })">
                      <Lucide icon="Eye" class="w-4 h-4 mr-1" /> Görüntüle
                    </span>
                    <span v-if="user.can('regulations.update')" class="flex items-center ml-3 text-warning cursor-pointer"
                      @click="() => router.push({ name: 'regulations.edit', params: { regulation: regulation.slug } })">
                      <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Düzenle
                    </span>
                  </div>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

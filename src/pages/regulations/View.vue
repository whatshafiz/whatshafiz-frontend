<script setup lang="ts">
import Button from "@/base-components/Button";
import { useRegulationStore } from "@/stores/regulation"
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import Preview from "@/base-components/Preview";

const route = useRoute()
const regulationStore = useRegulationStore()
const regulation = ref({})

onBeforeMount(async () => {
  regulation.value = await regulationStore.fetchRegulation(route.params.regulation as string)
})
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
  </div>
  <div class="overflow-x-auto">
    <Preview class="mt-5 intro-y box h-min sm:w-full md:w-2/3"> 
      <div class="p-5 border-b sm:flex-row border-slate-200/60">
        <h2 class="mr-auto text-base font-medium">{{ regulation.name }} Yönetmeliği</h2>
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
              <RouterLink :to="{ name: 'regulations.index' }">
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

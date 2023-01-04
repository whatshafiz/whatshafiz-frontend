<template>

  <div class="border-t border-white/10 dark:border-darkmode-400 mt-6 pt-6 text-white">
    <div class="grid grid-cols-12 gap-6" v-for="(setcats,catindex) in props.allLangs">


      <div class="col-span-8 lg:col-span-9 2xl:col-span-9">
        <button @click="activeIdChange(setcats.id)" class="flex items-center block w-full py-2 rounded-md" :class="props.activeId == setcats.id ? 'bg-white/10 dark:bg-darkmode-700 font-medium mt-2' : ''" >
          <img :src="setcats.flag" class="w-4 h-4 mr-2 ml-2 img-rounded">
          {{ setcats.name }}
        </button>
      </div>


      <div class="col-span-3 lg:col-span-3 2xl:col-span-3 py-2 ">
        <button class="btn  box bg-white/10 dark:bg-darkmode-700"  @click="formStatus(true); formType('update'); langId(setcats.id);" >
          <Edit2Icon class="w-4 h-4 mr-2 text-center" />
        </button>

      </div>
    </div>

  </div>
</template>


<script setup>

await new Promise((res) => setTimeout(res, 5000));

const props = defineProps({
  allLangs: {
    type: Array,
    required: true,
  },
  activeId: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['formStatus','formType','langId','activeIdChange']);
const formStatus = (e) => {emit('formStatus',e)};
const formType = (e) => {emit('formType',e)};
const langId = (e) => {emit('langId',e)};
const activeIdChange = (e) => {emit('activeIdChange',e)};
</script>
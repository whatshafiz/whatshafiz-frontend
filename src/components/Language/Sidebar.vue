<template>
  <div class="intro-y box bg-primary p-5 mt-6">
    <button @click="state.formOpen=true; state.formType='new';" type="button" class="btn text-slate-600 dark:text-slate-300 w-full bg-white dark:bg-darkmode-300 dark:border-darkmode-300 mt-1">
      <Edit3Icon class="w-4 h-4 mr-2" /> Yeni Ayar Ekle
    </button>

    <transition name="slide-fade">
     <LanguageForm v-if="state.formOpen" :formType="state.formType" :activeId="props.activeId" :langId="state.langId" @reRenderLanguages="reRenderLanguages" @closeForm="closeForm(e)" />
    </transition>
    <Suspense>
    <LangButtons :all-langs="props.allLangs" @formStatus="formStatus" @formType="formType" @langId="langId" @activeIdChange="activeIdChange" :activeId="activeId" />
      <template #fallback>
        <LangButtonsSkeleton v-for="(key,ind) in props.allLangs" />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import LanguageForm from "@/components/Language/Form.vue";
import {useToast} from "vue-toastification";
import LangButtons from "@/components/Language/LangButtons.vue";
import LangButtonsSkeleton from "@/components/Language/LangButtonsSkeleton.vue";
const toast = useToast();

const state = reactive({
  formOpen:false,
  formType:null,
  langId:null,
})

const props = defineProps(
    {
      allLangs: {
        type: Array,
        required: true,
      },
      activeId: {
        type: Number,
        required: true,
      },
    },
)

const formStatus = (e) => {state.formOpen = e};
const formType = (e) => {state.formType = e};
const langId = (e) => {state.langId = e};




const emit = defineEmits(['activeIdChange','getLangs'])
const closeForm = (e) => { state.formOpen=false; state.formType=null; state.langId=null; }
const activeIdChange = (e) => { emit('activeIdChange', e) }
const reRenderLanguages = (e) => { emit('getLangs', e) }
</script>


<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
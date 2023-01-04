<template>
  <div class="intro-y box bg-primary p-5 mt-6 ">
    <button @click="state.createOne=!state.createOne" type="button" class="btn text-slate-600 dark:text-slate-300 w-full bg-white dark:bg-darkmode-300 dark:border-darkmode-300 mt-1">
      <Edit3Icon class="w-4 h-4 mr-2" /> Yeni Ayar Ekle
    </button>

    <div class="border-t border-white/10 dark:border-darkmode-400 mt-6 pt-6 text-white" v-if="state.createOne">

      <BaseInput label="İsim" id="isim" v-model="validate.state.settings_name.$model" :errors="validate.state.settings_name.$errors" />
      <div class="mt-3">
        <label for="selectInputType"  class="form-label">Tip</label>
        <select id="selectInputType" v-model="validate.state.settings_type.$model" class="form-control">
          <option value="">Seçim Yapınız</option>
          <option :value="index" v-for="(opt,index) in typeOptions">{{opt}}</option>
        </select>
        <div class="input-errors" v-for="(error, index) of validate.state.settings_type.$errors" :key="index">
          <small class="p-error">{{ error.$message }}</small>
        </div>
      </div>

      <div class="col-span-12 mt-4">
        <button type="button" class="btn btn-primary w-full" @click="handleCreate" :disabled="validate.state.$invalid">
          Oluştur
        </button>
      </div>


    </div>


    <div class="border-t border-white/10 dark:border-darkmode-400 mt-6 pt-6 text-white">
      <button @click="activeIdChange(setcats.id)" class="flex items-center block w-full px-3 py-2 rounded-md" :class="props.activeId == setcats.id ? 'bg-white/10 dark:bg-darkmode-700 font-medium mt-2' : ''" v-for="(setcats,catindex) in props.categories">
        <SlackIcon class="w-4 h-4 mr-2" />
        {{ setcats.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import BaseInput from "@/components/UI/BaseInput.vue";
import {email, minLength, required, sameAs} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import axios from "axios";
import {useToast} from "vue-toastification";
const toast = useToast();
const props = defineProps(
  {
    categories: {
      type: Array,
      required: true,
    },
    activeId: {
      type: Number,
      required: true,
    },
  },
)
const typeOptions = ref({'input_text':'Metin','input_toggle':'Aç/Kapa','input_file':'Dosya Yükle'})

const state = reactive({
  createOne:false,
  settings_name:null,
  settings_type:"",
})


const rules = {
  state:{
    settings_name: { required, minLength: minLength(2) },
    settings_type:{ required, minLength: minLength(2) },
  }
}
const validate = useVuelidate(rules,{state});

const handleCreate = () => {
  let formData = new FormData();
  formData.append('settings_name', state.settings_name);
  formData.append('settings_type', state.settings_type);
  formData.append('settings_categories_id', props.activeId);
  formData.append('settings_val', ' ');

  axios.post('/admin/settings',formData).then((response) => {
      state.createOne = false
      state.settings_name = null
      state.settings_type = null
      activeIdChange(props.activeId)
      toast.success("Kullanıcı kaydı tamamlandı.");
  }).catch((error) => {
    console.log(error)
  })
}

const emit = defineEmits(['activeIdChange'])

const activeIdChange = (e) => { emit('activeIdChange', e) }
</script>
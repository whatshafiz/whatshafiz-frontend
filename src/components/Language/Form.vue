<template>
  <div class="border-t border-white/10 dark:border-darkmode-400 mt-6 pt-6 text-white">
    <BaseInput label="İsim" id="isim" v-model="validate.state.name.$model" :errors="validate.state.name.$errors" />
    <div class="mt-3"></div>
    <BaseInput label="Kod" id="kod" v-model="validate.state.code.$model" :errors="validate.state.code.$errors" />
    <div class="mt-3">
      <label for="selectInputType"  class="form-label">Tip</label>
      <select id="selectInputType" v-model="validate.state.active.$model" class="form-control bg-white text-black dark:text-white dark:bg-darkmode-800">
        <option value="">Seçim Yapınız</option>
        <option :value="index" v-for="(opt,index) in statusOptions">{{opt}}</option>
      </select>
      <div class="input-errors" v-for="(error, index) of validate.state.active.$errors" :key="index">
        <small class="p-error">{{ error.$message }}</small>
      </div>
    </div>


    <div class="grid grid-cols-3 gap-4 mt-3 justify-center">

      <div class="col-span-2 cursor-pointer relative">
        <span class="text-white leading-10">Bayrak seçimi için tıklayınız</span>
        <input
            id="flag"
            type="file"
            class=" top-0 left-0 opacity-0 absolute"
            @change="imageFileChanged($event)"
        />
      </div>

      <div>
        <img v-if="state.realFlagPath" :src="state.realFlagPath" class=" w-10 h-10 rounded-full" data-action="zoom" />
      </div>

    </div>

    <div class="grid grid-cols-2 gap-2">

    <div class="mt-4" v-if="!state.processing">
      <button v-if="props.formType == 'new'" @click="handleCreate" type="button" class="btn btn-dark w-full" :disabled="validate.state.$invalid">
        <span>Oluştur</span>
      </button>
      <button v-else @click="handleUpdate" type="button" class="btn btn-dark w-full" :disabled="validate.state.$invalid">
        <span>Güncelle</span>
      </button>
    </div>

    <div class="w-full" v-else>
      <button type="button" class="btn btn-primary w-full" disabled>
        <div class="flex flex-col justify-end items-center">
          <LoadingIcon icon="three-dots" class="w-8 h-8" />
          <div class="text-center text-xs mt-1">Lütfen bekleyiniz...</div>
        </div>
      </button>
    </div>


    <div class="mt-4" v-if="!state.processing">
      <button @click="handleClose(false)" type="button" class="w-full btn btn-outline-secondary w-full">
        <span>İptal</span>
      </button>
    </div>
    </div>


  </div>
</template>

<script setup>
import BaseInput from "@/components/UI/BaseInput.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import axios from "axios";
import {useToast} from "vue-toastification";
const toast = useToast();
const emit = defineEmits(['reRenderLanguages','closeForm']);
const reRenderLanguages = (e) => { emit('reRenderLanguages', e) }
const handleClose = (e) => { emit('closeForm', e) }

const props = defineProps({
  formType: {
    type: String,
    required: true
  },
  langId: {
    type: Number,
    required: false
  }
})

const state = reactive({
  name:null,
  code:null,
  flag: [],
  active:"",
  realFlagPath:null,
  processing:false,
})

const rules = {
  state:{
    name: { required, minLength: minLength(2) },
    code:{ required, minLength: minLength(2) },
    flag:{ required },
    active:{ required },
  }
}
const validate = useVuelidate(rules,{state});



const statusOptions = ref({'0':'Pasif','1':'Aktif'})

const imageFileChanged = (event) => {
  state.flag = event.target.files[0];
  state.realFlagPath = URL.createObjectURL(event.target.files[0]);
}


const handleCreate = () => {
  state.processing = true;
  let formData = new FormData();
  formData.append('name', state.name);
  formData.append('code', state.code);
  formData.append('flag', state.flag);
  formData.append('active', state.active);
  formData.append('default', 0);

  axios.post('/admin/language',formData).then((response) => {
    state.name = null
    state.code = null
    state.flag = null
    state.realFlagPath = null
    state.active = ""
    toast.success("Yeni dil kaydı tamamlandı.");
    state.processing = false;
    reRenderLanguages();
    handleClose();
  }).catch((error) => {
    toast.error("Yeni dil kaydı tamamlanamadı.");
    state.processing = false;
  })
}

const handleUpdate = (e) => {
  state.processing = true;

  let formData = new FormData();
  formData.append('name', state.name);
  formData.append('code', state.code);
  formData.append('flag', state.flag);
  formData.append('active', state.active);
  formData.append('default', 0);
  formData.append('_method', 'PUT');


  axios.post('/admin/language/'+props.langId, formData).then((response) => {
    toast.success("Dil güncellendi.");
    state.processing = false;
    reRenderLanguages();
    handleClose();
  }).catch((error) => {
    toast.error("Dil güncellenemedi.");
    state.processing = false;
  })
}

const getLanguage = () => {
  axios.get('/admin/language/'+props.langId).then((response) => {
    let res = response.data.data
    state.name = res.name
    state.code = res.code
    state.realFlagPath = res.flag
    state.flag = res.flag
    state.active = res.active
  }).catch((error) => {
    toast.error("Dil bilgileri alınamadı.");
  })
}
watch(() => props.formType, (val) => {
  if(val == 'update'){
    getLanguage();
  }else{
    state.name = null
    state.code = null
    state.flag = null
    state.realFlagPath = null
    state.active = ""
  }
})
watch(() => props.langId, (val) => {
  if(val){
    getLanguage();
  }
})
onMounted(
    () => {
      if(props.formType == 'update'){
        getLanguage();
      }
    }
)
</script>


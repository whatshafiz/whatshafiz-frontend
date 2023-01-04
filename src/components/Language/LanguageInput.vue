<template>
  <input
      :id="props.id"
      type="text"
      class="form-control block w-full"
      :value="props.modelValue[props.langKey]"
      @input="$emit('update:modelValue'+[props.langKey], $event.target.value)"
      @change="handleUpdate"
  />

</template>

<script setup>
import axios from "axios";
import {useToast} from "vue-toastification";
const toast = useToast();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  constants_id: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  langKey:{
    type: String,
    required:true
  }
});

const handleUpdate = (e) => {
  let formData = new FormData();
  formData.append('values['+props.langKey+']', e.target.value);
  formData.append("_method", "PUT");


  axios.post(`/admin/languageconstant/${props.constants_id}`, formData).then((response) => {
    toast.success('Ayar güncellendi')
  }).catch((error) => {
    toast.error('Ayar güncellenemedi')
  });
}
</script>
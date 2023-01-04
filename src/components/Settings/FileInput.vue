<template>
  <div class="grid grid-cols-6">
    <div class="col-start-1 col-end-7 cursor-pointer relative">
      <span class="text-primary mr-1 dark:text-white">Bir dosya seçin</span> ya da sürükleyip buraya bırakın
      <input
          :id="props.id"
          type="file"
          class="w-full h-full top-0 left-0 absolute opacity-0"
          @change="handleUpdate"
          @input="$emit('update:modelValue', $event.target.value)"
      />
      </div>
      <div class="col-end-7 col-span-2" v-if="props.modelValue != null">
        <img
            :alt="props.id"
            :src="props.modelValue"
            data-action="zoom"
            class="w-24 rounded-md float-right"
        />
      </div>
  </div>
</template>

<script setup>
import axios from "axios";
import {useToast} from "vue-toastification";
import {reactive} from "vue";


const toast = useToast();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  setting_id: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: String,
  },
});

const state = reactive({
  file: null,
});


const handleUpdate = (e) => {
  const file = e.target.files[0];
  state.file = URL.createObjectURL(file);




  let formData = new FormData();
  formData.append("id", props.setting_id);
  formData.append("_method", "PUT");
  formData.append("settings_type", "input_file");
  formData.append("settings_val", "null");
  formData.append("set_file", file);


  axios.post(`/admin/settings/${props.setting_id}`, formData).then((response) => {
    toast.success('Ayar güncellendi')
  }).catch((error) => {
    toast.error('Ayar güncellenemedi')
  });
}
</script>
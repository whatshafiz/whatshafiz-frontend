<template>
  <input
      :id="props.id"
      type="text"
      class="form-control block w-full"
      :value="props.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
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
  setting_id: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

const handleUpdate = () => {
  let formData = new FormData();
  formData.append("id", props.setting_id);
  formData.append("settings_val", props.modelValue);
  formData.append("_method", "PUT");

  axios.post(`/admin/settings/${props.setting_id}`, formData).then((response) => {
    toast.success('Ayar güncellendi')
  }).catch((error) => {
    toast.error('Ayar güncellenemedi')
  });
}
</script>
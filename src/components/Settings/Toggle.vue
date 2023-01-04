<template>
    <div class="form-check form-switch">
      <input
          :id="props.id"
          class="form-check-input"
          type="checkbox"
          :value="props.checked"
          @input="$emit('update:checked', $event.target.checked)"
          @change="handleUpdate"
          :checked="props.checked"
      />
    </div>
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
  checked: {
    type: Boolean,
  },
});

const handleUpdate = (e) => {
  let durum = e.target.checked ? 1 : 0;

  let formData = new FormData();
  formData.append("id", props.setting_id);
  formData.append("settings_val", durum);
  formData.append("_method", "PUT");


  axios.post(`/admin/settings/${props.setting_id}`, formData).then((response) => {
    toast.success('Ayar güncellendi')
  }).catch((error) => {
    toast.error('Ayar güncellenemedi')
  });
}
</script>
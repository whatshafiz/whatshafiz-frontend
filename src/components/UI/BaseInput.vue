<template>

  <label :for="id" class="form-label">{{ label }}</label>
  <input
      :id="id"
      type="text"
      class="form-control text-black dark:text-white"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
  />
  <div class="input-errors" v-for="(error, index) of errors" :key="index">
    <small class="p-error">{{ error.$message }}</small>
  </div>
</template>

<script>
export default {
  props: ['id','label', 'modelValue', 'errors'],
}
</script>
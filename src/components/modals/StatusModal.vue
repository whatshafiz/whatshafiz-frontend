<template>
  <Modal :show="statusModalRef.show" @hidden="statusModalRef.show = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <CheckCircleIcon class="w-16 h-16 text-success mx-auto mt-3" v-if="statusModalRef.type == 'Success'" />
        <AlertCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" v-else />
        <div class="text-3xl mt-5">{{ statusModalRef.type == 'Success'  ? 'Başarılı' : 'Başarısız' }}</div>
        <div class="text-slate-500 mt-2">
          {{ statusModalRef.message }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="statusModalRef.show = false" class="btn btn-primary w-24">
          Kapat
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>



<script setup>
defineProps(
    {
      statusModalRef: {
        type: Object,
        required: true,
      }
    }
)
</script>
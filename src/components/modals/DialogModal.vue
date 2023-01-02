<template>
  <div>
  <Modal :show="state.previewDialogModal" @hidden="state.previewDialogModal=false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <HashIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">{{ processInfo.title }}</div>
        <div class="text-slate-500 mt-2">
          İşlem geri alınamaz. <br /> {{processInfo.description}}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="state.previewDialogModal = false" class="btn btn-outline-secondary w-24 mr-1">
          İptal Et
        </button>
        <button @click="handleProcess" type="button" class="btn btn-danger w-24">
          {{ processInfo.buttonText }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <StatusModal :show="statusModalRef.show" :statusModalRef="statusModalRef" />
  </div>
</template>

<script setup>
import StatusModal from "./StatusModal.vue";
import {reactive} from "vue";
import axios from "axios";import {useRouter} from "vue-router";

const router = useRouter()

const statusModalRef = reactive(
    {
      show: false,
      message: "",
      type: "",
    }
);

const props = defineProps(
  {
    state: {
      type: Object,
      required: true,
    },
    processInfo: {
      type: Object,
      required: true,
    },
  },
)

const emit= defineEmits(["dialogModalStatus"])

const handleProcess = () => {
  if(props.processInfo.proccess == 'delete'){
    axios.delete(props.processInfo.processUrl + props.processInfo.processId)
        .then((response) => {
          if (response.status === 200) {
            statusModalRef.message = response.data.message;
            statusModalRef.type = "Success";
            statusModalRef.show = true;

            emit("dialogModalStatus", false)
            setTimeout(() => {
              statusModalRef.show = false;

              router.back();
            }, 2000)
          }
        })
        .catch((error) => {
          statusModalRef.show = true;
          statusModalRef.message = error.response.data.message;
          statusModalRef.type = "Error";
          emit("dialogModalStatus", false)
        });
  }else{
    alert('Proses bilgisi bulunamadı.');
  }

}


</script>
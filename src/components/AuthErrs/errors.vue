<template>
  <div>
    <div  v-for="(err,index) in errors" :key="index" >
      <Alert class="alert-primary flex items-center mb-2 mt-2 intro-x xl:mt-8 text-center xl:text-left">
          <AlertCircleIcon class="w-6 h-6 mr-2" />  {{err}} 
      </Alert>
      
      <button @click="activationCodeSendAgain" class="btn btn-pending w-full mr-2 mb-2 flex items-center mt-2 intro-x xl:mt-8 text-center xl:text-left" v-if="err === 'E-posta adresinizi doğrulamanız gerekiyor.'">
        <SendIcon class="w-4 h-4 mr-2" /> Aktivasyon linkini tekrar gönder
    </button>
  </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "AuthErrs",
  emits: ["activationCodeSendAgain"],
  props: {
    errors:{}
  },
  methods: {
    activationCodeSendAgain(){
      this.$emit("activationCodeSendAgain");
    }
  },
});
 
</script>
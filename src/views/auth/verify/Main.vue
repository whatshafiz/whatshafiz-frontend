<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <LoginLeft />
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
          class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">



          <div class="intro-x mt-8">
           <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-center">
            Üye Paneli
          </h2>

          <div class="w-full relative group flex flex-col  gap-2 items-center justify-start">

            <div class="w-full flex gap-2 items-center justify-center flex-col">
              <div class="flex justify-center w-full mt-2 border-t mt-10 border-slate-200/60 dark:border-darkmode-400">
                <div class="px-5 -mt-3 bg-white dark:bg-darkmode-600 text-slate-500">
                  Mobil Doğrulama
                </div>
              </div>

              <p class="w-full text-center bg-sky-100 my-3 p-2">
               Telefon numaranıza WhatsApp üzerinden doğrulama kodu gönderilecektir.
             </p>

             <div class="w-full relative group flex flex-col md:flex-row gap-2 items-center justify-start">


              <div class="w-full relative">

                <button class="absolute right-1 top-2 z-50  text-gray-200  hover:text-gray-600" @click="authStore.destroyToken()" >
                 <EditIcon  class="w-8 h-8 group-hover:text-slate-600" />
               </button>

               <input type="text" readonly class="intro-x login__input form-control py-3 px-4 block z-10 relative" v-model="phone_number" @keyup.enter="check()" />
             </div>
           </div>

           <div class="w-full flex gap-2 items-center justify-center mt-3">

            <button @click="sendCode()" class="btn btn-primary py-3 px-4 w-3/4 md:w-1/2 mt-3 xl:mt-0 align-top rounded-xl">Whatsapp'a Kodu Gönder</button>
            <button  class="btn btn-secondary py-3 px-4 w-1/4 md:w-1/2 mt-3 xl:mt-0 align-top rounded-xl" @click="authStore.destroyToken()">İptal</button>
          </div>

        </div>



        <div class="w-full relative flex flex-col gap-2">

          <input type="text" class="intro-x login__input form-control py-3 px-4 block z-10 relative" placeholder="XXXX"
          v-model="code"   />

        </div>


      </div>






    </div>




  </div>
</div>
<!-- END: Login Form -->
</div>
</div>
</div>
</template>
<script>
  import { onMounted } from "vue";
  import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
  import LoginLeft from "@/components/customs/login-left.vue";
  import dom from "@left4code/tw-starter/dist/js/dom";
  import AuthErrs from '@/components/AuthErrs/errors.vue';
  import { useAuthStore } from "@/stores/auth";
  import axios from "axios";



  export default {
    setup() {
      const authStore = useAuthStore();

      const bodyChange = onMounted(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
      });

      return { authStore, bodyChange };
    },
    data() {
      return {
       code: "",
       sendCodeState: false,
       active_state: false,
       settings: [],
       phone_number: "",


     }
   },
   components: {
    AuthErrs,
    DarkModeSwitcher,
    LoginLeft
  },


  mounted() {
    this.checkViaWhatsapp();
    this.phone_number = this.authStore.user.phone_number;

  },


  methods: {

    async sendCode() {

      await axios.post("/register/verification-code/send").then(response => {

        this.sendCodeState = true

      }).catch(error => {
        console.log(error);
      });

    },


    async checkViaWhatsapp() {

      await axios.get("/settings").then(response => {

        this.settings = response.data

        this.settings.forEach((item) => {
          if(item.name == "whatsapp-verification-is-active-on-user-registration" && parseInt(item.value) == 1){
            this.active_state = true
          }
        });


      }).catch(error => {
        console.log(error);
      });

    },





  },
}
</script>
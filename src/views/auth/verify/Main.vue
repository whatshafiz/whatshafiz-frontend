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

          <div class="w-full relative group flex flex-col  gap-2 items-center justify-start" v-if="!verified_phone">

            <div class="w-full flex gap-2 items-center justify-center flex-col" v-if="!codeSended">
              <div class="flex justify-center w-full mt-2 border-t mt-10 border-slate-200/60 dark:border-darkmode-400">
                <div class="px-5 -mt-3 bg-white dark:bg-darkmode-600 text-slate-500">
                  Mobil Doğrulama
                </div>
              </div>

              <p class="w-full text-center bg-sky-100 my-3 p-2">
               Telefon numaranıza WhatsApp üzerinden doğrulama kodu gönderilecektir.
             </p>

             <div class="w-full relative group flex flex-col md:flex-row gap-2 items-center justify-start">
              <Alert class="alert-warning w-full flex items-center mb-2" v-if="error_toast">
                <AlertCircleIcon class="w-6 h-6 mr-2" /> {{error_toast}}
              </Alert>

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



        <div class="w-full relative flex flex-col gap-2" v-else>

         <p class="w-full text-center bg-sky-100 my-3 p-2">
           Lütfen gelen mesajı <b>Spam Değil</b> veya <b>Tamam</b> olarak işaretleyin.
         </p>
         <Alert class="alert-warning w-full flex items-center mb-2" v-if="error_toast">
          <AlertCircleIcon class="w-6 h-6 mr-2" /> {{error_toast}}
        </Alert>

        <label for="">Doğrulama Kodu : </label>
        <input type="text" class="intro-x login__input form-control py-3 px-4 block z-10 relative" placeholder="XXXXXX"
        v-model="code" />

        <span v-if="timer" class="px-2 text-slate-500">
          <vue-countdown :time="timer" v-slot="{minutes, seconds }" @end="onCountdownEnd">
           {{ minutes }}:{{ seconds }}  
         </vue-countdown>
       </span>

       <hr>

       <button @click="verifyCode()" class="btn btn-primary py-3 px-4 relative w-3/4 md:w-1/2 mt-3 xl:mt-0 align-top rounded-xl">Doğrula
        <ShieldCheckIcon  class="w-6 h-6 animate-pulse text-white absolute right-1  hover:bg-slate-400  hover:text-white  hover:p-1  hover:rounded-md" />
      </button>

    </div>


  </div>

  <div v-else class="w-full relative mt-4 mb-4 group flex flex-col  gap-2 items-center justify-start">
    <Alert class="bg-lime-600 w-full flex items-center mb-2 text-white"  >
      <ShieldCheckIcon class="w-6 h-6 mr-2" /> Telefon numaranız başarılı bir şekilde doğrulanmıştır.
    </Alert>

    <router-link to="/complete-profile" tag="a" class="btn btn-primary py-3 px-4 relative w-3/4 md:w-1/2 mt-3 xl:mt-0 align-top rounded-xl">Devam</router-link>
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
  import moment from 'moment'
  import VueCountdown from '@chenfengyuan/vue-countdown';

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
       codeSended: false,
       active_state: false,
       settings: [],
       phone_number: "",

       timer: false,
       expired_time: false,
       error_toast: false,
       verified_phone: false,


     }
   },
   components: {
    AuthErrs,
    DarkModeSwitcher,
    LoginLeft,
    VueCountdown
  },


  mounted() {
    this.checkViaWhatsapp();
    this.checkVerifyuser();
    this.phone_number = this.authStore.user.phone_number;

    const expired_time = localStorage.getItem('expired_time');

    if (expired_time !== undefined && expired_time !== null ) {




      const end = moment(expired_time,"DD-MM-YYYY HH:mm:ss").unix();

      let now = moment().unix();




      if (now < end) {

        this.codeSended = true;
        this.timerStart(expired_time);
      }else{
       localStorage.removeItem('expired_time');
       this.codeSended = false;
     }
   }else{
     localStorage.removeItem('expired_time');
     this.codeSended = false;
   }

 },


 methods: {


  onCountdownEnd(){

   this.timer = false
   this.codeSended = false
   this.error_toast = "Süre Doldu Lütfen Tekrar Deneyin"

 },
 timerStart(expired_time){

   const end = moment(expired_time,"DD-MM-YYYY HH:mm:ss").unix();

   let now = moment().unix();
   let diff = end - now;
   this.timer = diff*1000;
 },

 async sendCode() {

  await axios.post("/register/verification-code/send").then(response => {

    this.codeSended = true
    this.expired_time = response.data.verification_code_valid_until
    localStorage.setItem('expired_time', this.expired_time)
    this.timerStart(this.expired_time)

  }).catch(error => {

    this.error_toast = error.response.data.message;
  });

},


async verifyCode() {

  await axios.post("/register/verification-code/verify",{code:this.code}).then(response => {

   this.verified_phone = true


 }).catch(error => {

  this.error_toast = error.response.data.message;
});

},


async checkVerifyuser() {

  await axios.get("/profile").then(response => {

    if (response.data.user.phone_number_verified_at !== null) {
     this.verified_phone = true
   }



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

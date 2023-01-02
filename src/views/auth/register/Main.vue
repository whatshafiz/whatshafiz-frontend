<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Register Info -->
        <LoginLeft />
        <!-- END: Register Info -->
        <!-- BEGIN: Register Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
          class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
          <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
            Üye Kayıt <small> ({{program_type==1 ? 'Hafız Ol' : 'Hafız Kal'}})</small>
          </h2>

          <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
            {{program_type==1 ? 'Hafız Ol' : 'Hafız Kal'}} Programına Kayıt oluyorsunuz.
          </div>
          <div class="intro-x mt-8">
            <AuthErrs v-if="errors.length > 0" :errors="errors" />

              <div class="w-full relative group flex flex-col md:flex-row gap-2 items-center justify-start">



                <div class="w-32">
                  <TomSelect  v-model="countryCode" :options="{
                    placeholder: 'Kod',
                    minHeight: '45px',
                  }" class="w-full">
                  <option :value="item.phone_code" v-if="countryCodes.length>0" v-for="item in countryCodes">{{item.iso}} {{item.phone_code}}</option>

                </TomSelect>
              </div>
              <div class="w-full relative">

               <button class="absolute right-1 top-2 z-50  text-gray-200  hover:text-gray-600"
               @click="check"
               >
               <LoaderIcon v-if="proccessing_check" class="w-8 h-8 animate-spin" />
               <CheckCircleIcon v-else-if="checkState"  class="w-8 h-8 text-lime-600" />
               <ArrowRightCircleIcon v-else class="w-8 h-8 group-hover:text-slate-600" />


             </button>

             <input type="text" class="intro-x login__input form-control py-3 px-4 block z-10 relative" placeholder="GSM"
             v-model="phone_number" @keyup.enter="check()" />
           </div>
         </div>

         <div class="w-full relative" v-if="checkState">


          <input type="password" ref="pass_input"  class="intro-x login__input form-control py-3 px-4 block mt-4" placeholder="Şifre"
          v-model="password"   />


          <input type="password"   class="intro-x login__input form-control py-3 px-4 block mt-4" placeholder="Şifre Tekrar"
          v-model="password_confirmation"   />



        </div>

      </div>

      {{program_type}}


      <div v-if="checkState" class="intro-x mt-5 xl:mt-8 text-center flex items-center justify-center xl:text-left">
        <button class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" @click="register">
          Kayıt Ol
          <LoadingIcon v-if="proccessing" icon="oval" color="white" class="w-4 h-4 ml-2" />
        </button>

      </div>



      <div class="flex justify-center w-full mt-2 border-t mt-10 border-slate-200/60 dark:border-darkmode-400">
        <div class="px-5 -mt-3 bg-white dark:bg-darkmode-600 text-slate-500">
          Kayıtlı Üye misin?
        </div>
      </div>

      <div class="w-full flex gap-2 items-center justify-center mt-3">

        <router-link to="/auth/login" tag="a"
        class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">Giriş</router-link>
      </div>
    </div>
  </div>
  <!-- END: register Form -->
</div>
</div>


</div>




<Modal
backdrop="static"
:show="staticBackdropModalPreview"
@hidden="staticBackdropModalPreview = false"
>
<ModalBody class="px-5 py-10">
  <div class="text-center flex flex-col items-center justify-center gap-3" v-if="program_type == 1">
    <div class="mb-5">
      <h4 class="text-lg font-bold">Hafız Ol</h4>
      <b>Hafız ol</b> programını tercih ettiniz. <br />Bu program; daha önceden hafızlık yapmadığınız, hafız olma adayı olduğunuz anlamına gelmektedir. Bu programda Hafız Kal programı gibi ezber dinleyerek değil ezber vererek icra edilen bir uygulamadır.
    </div>
    <button
    type="button"
    @click="staticBackdropModalPreview = false"
    class="btn btn-primary w-8/12"
    >
    Evet hafız ol ile devam et
  </button>

  <button @click="[staticBackdropModalPreview = false,program_type=2]" class="btn btn-outline-secondary py-3 px-4 w-8/12 mt-3 xl:mt-0 align-top rounded-xl">Hafız Kal programına kayıt ile devam et</button>
</div> 

<div class="text-center flex flex-col items-center justify-center gap-3" v-if="program_type == 2">
  <div class="mb-5">
   <h4 class="text-lg font-bold">Hafız Kal</h4>
   <b>Hafız Kal</b> programını tercih ettiniz. <br />Bu program; daha önceden hafızlık tedrisatını tamamladığınız anlamına gelmektedir. 
 </div>
 <button
 type="button"
 @click="staticBackdropModalPreview = false"
 class="btn btn-primary w-8/12"
 >
 Evet Hafız Kal ile devam et
</button>

<button @click="[staticBackdropModalPreview = false,program_type=1]" class="btn btn-outline-secondary py-3 px-4 w-8/12 mt-3 xl:mt-0 align-top rounded-xl">Hafız Ol programına kayıt ile devam et</button>
</div>
</ModalBody>
</Modal>

</template>

<script>
  import { onMounted, reactive, toRefs ,ref} from "vue";
  import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
  import LoginLeft from "@/components/customs/login-left.vue";
  import dom from "@left4code/tw-starter/dist/js/dom";
  import { def } from "@vue/shared";
  import axios from "axios";
  import AuthErrs from '@/components/AuthErrs/errors.vue';
  import { useAuthStore } from "@/stores/auth";
  import { mapStores } from 'pinia';
  import { useRoute } from 'vue-router';


  export default {
    setup() {
      const authStore = useAuthStore();
      const bodyChange = onMounted(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
      });



      const route = useRoute()
      const program_type = ref(route.query.type);

      const staticBackdropModalPreview = ref(true);

      return { authStore, bodyChange,program_type,staticBackdropModalPreview };


    },
    mounted() {
      this.getCountryCode();

    },


    data() {
      return {
        phone_number: "",
        password: "",
        password_confirmation: "",

        errors: [],
        proccessing: false,
        isRegistered: false,
        proccessing_check: false,
        checkState: false,
        countryCode: "90",
        countryCodes: [],
      }
    },
    components: {
      AuthErrs,
      DarkModeSwitcher,
      LoginLeft
    },
    watch: {
      isRegistered() {
        if (this.isRegistered) {
          this.$router.push('/auth/login');
        }
      },
      authStore: {
        immediate: true,
        deep: true,
        handler(newValue, oldValue) {
          if (newValue.errors) {
            this.errors = newValue.errors;
            this.proccessing = false;
          }
        }
      }
    },
    methods: {


      async getCountryCode() {


       await axios.get("/countries").then(response => {

        this.countryCodes = response.data.countries;

      }).catch(error => {
        console.log(error);
      });

    },


    async check() {

      this.errors = {}

      if (this.phone_number) {
        this.proccessing_check = true;
        const gsm = this.countryCode+this.phone_number;
        await axios.post("/users/check", { phone_number: gsm }).then(response => {


          if(response.data.is_banned){
            this.errors =  ["Aktif olmayan üyeliğe ait bir telefon numarası girdiniz."]
            this.proccessing_check = false;
            return;
          }

          if (response.data.is_registered && !response.data.is_banned) {


            this.errors = [gsm+ " için Aktif Üyelik mevcuttur! Şifrenizi mi unuttunuz? Şifremi Unuttum'a tıklayın."];
            this.proccessing_check = false;

          }else{

           this.checkState=true;
           this.proccessing_check = false;
           setTimeout(()=>{
            this.$refs.pass_input.focus();
                // this.$refs.pass_input.click();
          } , 500)

         }
       }).catch(error => {
        console.log(error);
      });


     } else {
      this.errors = ["Lütfen GSM alanını doldurunuz!"];
    }
  },

  async register() {


    if (this.password !== this.password_confirmation) {
      this.errors = ["Şifreler uyuşmuyor!"];
      return;
    }
    
    if (this.phone_number && this.password) {
      this.proccessing = true;
      const gsm = this.countryCode+this.phone_number;
      const result = this
      .authStore
      .createAccount( gsm, this.password, this.password_confirmation,this.program_type)
      .then(() => {

        this.errors = [];
        this.isRegistered = true;
            //this.router.push('auth/login');
      })
      this.proccessing = false;
    } else {
      this.errors = ["Lütfen tüm alanları doldurunuz!"];
    }

  },

},
}
</script>
<style>
  .tom-select .ts-input .item {
    line-height: 30px!important;
  }

  .tom-select .ts-input {
    min-height: 46px !important;
  }

  .login__input{
    min-width: 250px!important;
  }

</style>

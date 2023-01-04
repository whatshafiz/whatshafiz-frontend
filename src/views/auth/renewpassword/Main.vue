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
          <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-center">
            Üye Paneli
          </h2>


          <div class="intro-x mt-8">
            <AuthErrs :key="errors.length" v-if="errors.length > 0" :errors="errors"
              @activationCodeSendAgain="activationCodeSendAgain" />
              <div class="w-full relative group flex flex-col md:flex-row gap-2 items-center justify-start">



                <div class="w-full md:w-32 flex flex-col gap-2">
                  <label for="" class="px-1   text-sm font-bold">Ülke Kodu</label>
                  <TomSelect  v-model="countryCode" :options="{
                    placeholder: 'Ülke',
                    minHeight: '45px',
                  }" class="w-full">
                  <option :value="item.phone_code" v-if="countryCodes.length>0" v-for="item in countryCodes">{{item.iso}} {{item.phone_code}}</option>

                </TomSelect>
              </div>
              <div class="w-full relative flex flex-col gap-2">
                <label for="" class="px-1  text-sm font-bold">Telefon No</label>


                <input type="text" class="intro-x login__input form-control py-3 px-4 block z-10 relative" placeholder="5XXXXXXXXX"
                v-model="phone_number" @keyup.enter="check()" />




              </div>


            </div>

            <div class="w-full py-4" v-show="!checkState">
              <button class="btn btn-primary py-2 px-2 w-full md:w-1/3 ml-auto mt-3 xl:mt-0 align-top rounded-xl text-lg flex items-center justify-center"
              @click="check"
              >
              Devam 
              <LoaderIcon v-if="proccessing_check" class="w-8 h-8 absolute right-3 animate-spin ml-6" />
              <CheckCircleIcon v-else-if="checkState"  class="w-8 h-8 absolute right-3 text-lime-600 ml-6" />
              <ArrowRightCircleIcon v-else class="w-8 h-8 absolute right-3 hover:text-white ml-6" />


            </button>
          </div>


          <div class="w-full relative group mt-4" v-show="login_state">
            <label for="" class="px-1 text-sm font-bold">Şifre</label>
            <input type="password" ref="pass_input"  class="intro-x login__input form-control py-3 px-4 block mt-2" placeholder="Şifre"
            v-model="password" @keyup.enter="login()"  />



          </div>


          <div class="w-full relative group mt-4" v-show="login_state">
            <button class="btn btn-primary py-2 px-2 w-full md:w-1/3 ml-auto mt-3 xl:mt-0 align-top rounded-xl text-lg flex items-center justify-center"
            @click="login"
            >
            Giriş Yap 
            <LoaderIcon v-if="proccessing" class="w-8 h-8 absolute right-3animate-spin" />
            <LogInIcon v-else  class="w-8 h-8 absolute right-3 animate-pulse text-white  hover:bg-slate-400  hover:text-white  hover:p-1  hover:rounded-md" />


          </button>
        </div>

        <div class="w-full relative" v-if="register_state">


          <input type="password" ref="pass_input"  class="intro-x login__input form-control py-3 px-4 block mt-4" placeholder="Şifre"
          v-model="password"   />


          <input type="password"   class="intro-x login__input form-control py-3 px-4 block mt-4" placeholder="Şifre Tekrar"
          v-model="password_confirmation"   />



        </div>

        <div v-if="register_state" class="w-full relative mt-4">
          <button class="btn btn-primary py-2 px-2 w-1/3 ml-auto mt-3 xl:mt-0 align-top rounded-xl flex items-center justify-between" @click="register">

           <LoadingIcon v-if="proccessing" icon="oval" color="white" class="w-6 h-6 ml-2" />
           <ShieldCheckIcon v-else  class="w-6 h-6 animate-pulse text-white  hover:bg-slate-400  hover:text-white  hover:p-1  hover:rounded-md" />
           <span class="flex items-center justify-center w-9/12 text-md">Kayıt Ol</span>
         </button>

       </div>



     </div>
     <div class="intro-x flex flex-col text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4" v-show="login_state">

      <div class="flex justify-center w-full mt-2 border-t mt-10 border-slate-200/60 dark:border-darkmode-400">
        <div class="px-5 -mt-3 bg-white dark:bg-darkmode-600 text-slate-500">
          <ShieldCheckIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="flex">
        <div class="flex items-center mr-auto"  >
          <input id="remember-me" type="checkbox" class="form-check-input border mr-2" v-model="rememberMe" />
          <label class="cursor-pointer select-none" for="remember-me">Beni Hatırla</label>
        </div>
        <router-link to="/auth/forgot-password" tag="a">Şifremi Unuttum?</router-link>
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
       phone_number: "",
       password: "",
       password_confirmation: "",
       rememberMe: false,
       errors: {},
       proccessing: false,
       proccessing_check: false,
       checkState: false,
       register_state: false,
       login_state: false,
       countryCode: "90",
       countryCodes: [],

     }
   },
   components: {
    AuthErrs,
    DarkModeSwitcher,
    LoginLeft
  },


  mounted() {
    this.getCountryCode();


    const parametre = this.$route.query.type;

  },


  watch: {
    authStore: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if(newValue.errors){
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



  async login() {
    if (this.phone_number && this.password) {
      this.proccessing = true;
      const gsm = this.countryCode+this.phone_number;
      await this.authStore.retrieveToken(gsm, this.password, this.rememberMe);
    } else {
      this.errors = ["Lütfen tüm alanları doldurunuz!"];
    }
  },
  async check() {

    this.errors = {}

    if (this.phone_number) {

      this.proccessing_check = true;
      this.login_state = false;
      this.checkState = false;
      this.register_state = false;


      const gsm = this.countryCode+this.phone_number;
      await axios.post("/users/check", { phone_number: gsm }).then(response => {


       if (response.data.is_banned) {
        this.errors = ["Sistem tarafından banlandığınız için sisteme giriş yapamazsınız. Bir yanlışlık olduğunu düşünüyorsanız grup başkanınızla iletişime geçebilirsiniz."];
        this.checkState=true;
        this.login_state=false;
        this.proccessing_check = false;
        return false
      }

      if (response.data.is_registered && !response.data.is_banned) {
        this.checkState=true;
        this.login_state=true;
        this.proccessing_check = false;

        setTimeout(()=>{
          this.$refs.pass_input.focus();

        } , 500)

      }else{
         //   this.errors = [gsm+ " için Aktif Üyelik Bilgisi Bulunamadı!"];
        this.register_state = true;
        this.checkState=true;
        this.proccessing_check = false;
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
      this.router.push('auth/login');
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

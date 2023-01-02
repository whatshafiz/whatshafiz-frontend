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
           Profili Tamamla <small> ({{user_type==1 ? 'Hafız Ol' : 'Hafız Kal'}})</small>
         </h2>

         <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
          {{user_type==1 ? 'Hafız Ol' : 'Hafız Kal'}} Programına Kayıt oluyorsunuz.
        </div>
        <div class="intro-x mt-8">
          <AuthErrs v-if="errors.length > 0" :errors="errors" />

            <div class="w-full relative group flex flex-col md:flex-row gap-2 items-center justify-start">


              Lorem ipsum dolor, sit amet, consectetur adipisicing elit. Ipsam consequatur animi hic vero consequuntur eius iusto et dignissimos assumenda id, magni, nihil rerum dicta omnis illum inventore velit fuga. Voluptatibus!

            </div>



          </div>





        </div>
      </div>
      <!-- END: register Form -->
    </div>
  </div>


</div>



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
      const user_type = route.query.type;

      const staticBackdropModalPreview = ref(true);

      return { authStore, bodyChange,user_type,staticBackdropModalPreview };


    },
    mounted() {
      this.getCountryCode();

    },


    data() {
      return {
        formData:{
          name: 'Alan',
          surname: 'Carroll',
          email: 'Caden.Nolan39@hotmail.com',
          gender: 'male',
          country_id: '1',
          city_id: '1',
          university_id: '1',
          university_faculty_id: '1',
          university_department_id: '1' 
        },

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
      .createAccount( gsm, this.password, this.password_confirmation)
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

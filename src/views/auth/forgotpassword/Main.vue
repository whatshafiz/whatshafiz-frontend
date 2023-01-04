<template>
    <div>
      <DarkModeSwitcher />
      <div class="container sm:px-10">
        <div class="block xl:grid grid-cols-2 gap-4">
          <!-- BEGIN: Login Info -->
          <div class="hidden xl:flex flex-col min-h-screen">
            <a href="" class="-intro-x flex items-center pt-5">
              <img
                alt="Midone Tailwind HTML Admin Template"
                class="w-6"
                src="@/assets/images/logo.svg"
              />
              <span class="text-white text-lg ml-3"> ABF BİLİŞİM HİZMETLERİ </span>
            </a>
            <div class="my-auto">
              <img
                alt="Midone Tailwind HTML Admin Template"
                class="-intro-x w-1/2 -mt-16"
                src="@/assets/images/illustration.svg"
              />
              <div
                class="-intro-x text-white font-medium text-4xl leading-tight mt-10"
              >
                Hayalinizi <br />
                üretelim
              </div>
              <div
                class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400"
              >
                Tüm işlemlerinizi tek yerden yönetin..
              </div>
            </div>
          </div>
          <!-- END: Login Info -->
          <!-- BEGIN: Login Form -->
          <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
            <div
              class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
            >
              <h2
                class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left"
              >
                Şifremi Unuttum
              </h2>

              <div class="intro-x mt-8">
                
                <input
                  type="text"
                  class="intro-x login__input form-control py-3"
                  placeholder="E-Posta"
                  v-model="email"
                /> 
              </div>
             

              <AuthErrs v-if="errors.length>0" :errors="errors" />

                <div class="intro-x mt-4 text-center xl:text-left">
                    <button
                    class="btn btn-primary py-3 px-4 w-full mb-4 xl:mr-3 align-top"
                    @click="forgotPassword"
                    >
                    Giriş
                    <LoadingIcon v-if="proccessing" icon="oval" color="white" class="w-4 h-4 ml-2" />
                    </button>
                </div>
                <div class="intro-x w-full text-center flex">
                    <router-link to="/auth/login" tag="a" class="btn btn-outline-secondary py-3 w-1/2 align-top">Giriş</router-link>
                    <router-link to="/auth/register" tag="a" class="btn btn-outline-secondary py-3 w-1/2 align-top">Kayıt Ol</router-link>
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
  import dom from "@left4code/tw-starter/dist/js/dom";
  import AuthErrs from '@/components/AuthErrs/errors.vue';
  import { useAuthStore } from "@/stores/auth";

  


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
        email:null,
        errors:[],
        proccessing:false,
        isSend:false,
      }
    },
    components : {
      AuthErrs,
      DarkModeSwitcher
    },
    watch: {
        isSend(){
            if(this.isSend){
                this.$router.push('/auth/login');
            }
        },
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
        async forgotPassword(){
            if(this.email){
                this.proccessing = true;
                this.errors = [];
                await this.authStore.forgotPassword(this.email)
                .then(res => {
                    this.$notify({
                        group: 'auth',
                        title: 'Başarılı',
                        text: 'Lütfen e-posta adresinize gelen sıfırlama linkini kullanarak şifrenizi yenileyiniz.',
                        type: 'success',
                        duration: 5000
                    });
                    this.isSend = true;
                    this.proccessing = false;
                    this.errors = [];
                })
            } else {
                this.isSend = false;
                this.errors = ["Lütfen tüm alanları doldurunuz!"];
            }
        }

    },
}
  </script>
  
import { defineStore } from "pinia";
import axios from "axios";
import { useAlertStore } from "./alert";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  id: 'auth',
  state: () => ({
    user: {},
    auth:false,
    errors: {},
    token:localStorage.getItem('accessToken'),
  }),


  actions: {
    // async getToken(){
    //   await axios.get("/sanctum/csrf-cookie");
    // },

    async createAccount(phone_number,password,password_confirmation){
      this.errors = [];
      return new Promise((resolve, reject) => {
        axios.post("/register", {
         phone_number,
         password,
         password_confirmation 
       })
        .then( (response) => {

          const token = response.data.token;
          localStorage.setItem('accessToken', token)
          this.token = token;
          this.auth = true;
          this.user = response.data.profile;
          this.errors = [];
          router.push('/auth/verify')
          resolve(response);
        })
        .catch((error) => {
          this.errors = Object.values(error.response.data.errors).flat();
        });
      });
    },

    retrieveToken(phone_number, password,rememberMe) {
      this.errors = [];
      return new Promise((resolve, reject) => {
        axios.post("/login", {
          phone_number,
          password,
        })
        .then(response => { 

          if(response.data.profile.is_banned){
            this.errors = ['Hesabınız aktif değil. Sistem yönetimi ile iletişime geçin.'];
            return this.errors; 
          }

          // if(!this.userIsAdmin(response.data.data.profile.roles)){
          //   this.errors = ['Giriş yetkiniz yok.'];
          //   return this.errors;
          // } 

          const token = response.data.token;
          localStorage.setItem('accessToken', token)
          this.token = token;
          this.auth = true;
          this.user = response.data.profile;
          this.errors = [];
          router.push('/auth/verify')
          resolve(response)
        })
        .catch(error => {
          this.errors = Object.values(error.response.data.errors).flat();
        })
      })
    },

    forgotPassword(email){
      this.errors = [];
      return new Promise((resolve, reject) => {
        axios.post("/forgot-password", {
          email: email,
        })
        .then( (response) => {
          resolve(response);
        })
        .catch((error) => {
          this.errors = Object.values(error.response.data.errors).flat();
        });
      });
    },

    resetPassword(token,email,password,password_confirmation){
      this.errors = [];
      return new Promise((resolve, reject) => {
        axios.post("/reset-password", {
          token: token,
          email: email,
          password: password,
          password_confirmation: password_confirmation
        })
        .then( (response) => {
          resolve(response);
        })
        .catch((error) => {
          this.errors = Object.values(error.response.data.errors).flat();
        });
      });
    },

    verifyEmail(id,hash){
      this.errors = [];
      return new Promise((resolve, reject) => {
        axios.post("/email/verify", {
          id: id,
          hash: hash,
        })
        .then( (response) => {
          resolve(response);
        })
        .catch((error) => {
          this.errors = Object.values(error.response.data.errors).flat();
        });
      });
    },

    sendActivationAgain(email){
      this.errors = [];
      return new Promise((resolve, reject) => {
        axios.post("/email/resend",{email:email})
        .then( (response) => {
          resolve(response);
        })
        .catch((error) => {
          this.errors = Object.values(error.response.data.errors).flat();
        });
      });
    },
    



    async destroyToken(context) {
     localStorage.removeItem('accessToken')
     this.user = null;
     this.auth = false;
     this.errors = [];
     this.token = null;

     router.push('/auth/login')
   },


   async getUser(){
    await axios.get("/profile").then(response => {
      this.user = response.data.user;
    }).catch(error => {
      this.user = null;
      this.auth = false;
      this.errors = [];
      this.token = null;

      localStorage.removeItem('accessToken')
    });
  },


  userIsAdmin(useci){
    let status = 0;
    useci.forEach(element => {
      if(element.name == 'admin'){
        status++;
      }
    });
    if(status > 0){
      return true;
    }else{
      return false;
    }
  },

  userIsActive(user){
    console.log(user)
    if(user.is_active == 1){
      return true;
    }else{
      return false;
    }
  }

},

getters: {
  loggedIn(state) {
    return state.user !== null;
  }
},



mutations: {
  RETRIEVE_TOKEN(state, token) {
    state.token = token
  }, 
}


});
<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 lg:col-span-12 2xl:col-span-12">
      <!-- BEGIN: Kişisel Bilgiler -->
      <div class="intro-y box lg:mt-5">
        <div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <h2 class="font-medium text-base mr-auto">Kişisel Bilgiler</h2>
        </div>
        <div class="p-5">
          <div class="flex flex-col-reverse xl:flex-row flex-col">
            <div class="flex-1 mt-6 xl:mt-0">
              <div class="grid grid-cols-12 gap-x-5">



                <div class="col-span-6 2xl:col-span-6">
                  <BaseInput label="İsim" id="isim" v-model="validate.state.name.$model" :errors="validate.state.name.$errors" />
                </div>


                <div class="col-span-6 2xl:col-span-6">
                  <BaseInput label="Soyisim" id="soyisim" v-model="validate.state.last_name.$model" :errors="validate.state.last_name.$errors" />
                </div>


                <div class="col-span-6 2xl:col-span-6 mt-3">
                  <BaseInput label="E-Posta" id="email" v-model="validate.state.email.$model" :errors="validate.state.email.$errors" />
                </div>
                <div class="col-span-6 2xl:col-span-6 mt-3">
                  <label for="rolsecimi" class="form-label">Rol Seçimi</label>
                  <TomSelect v-model="validate.state.roles.$model" :options="{ placeholder: 'Kullanıcının rollerini seçiniz.' }" class="w-full" multiple>
                    <option :selected="role.has_role" :value="role.name" v-for="(role,index) in state.all_roles" :key="index">{{role.name}}</option>
                  </TomSelect>
                  <div class="input-errors" v-for="(error, index) of validate.state.roles.$errors" :key="index">
                    <small class="p-error">{{ error.$message }}</small>
                  </div>
                </div>
              </div>

              <div class="col-span-6 2xl:col-span-6 mt-3">
                <BaseInput label="Şifre" id="password" v-model="validate.state.password.$model" :errors="validate.state.password.$errors" />
              </div>

              <div class="col-span-6 2xl:col-span-6 mt-3">
                <BaseInput label="Şifre Tekrarı" id="passwordagain" v-model="validate.state.password_confirmation.$model" :errors="validate.state.password_confirmation.$errors" />
              </div>

              <div class="flex flex-col-reverse xl:flex-row flex-col">
                <div class="flex-1 mt-6 xl:mt-0">
                  <div class="grid grid-cols-12 gap-x-5  mt-3">

                    <div class="col-span-12">
                      <button type="button" class="btn btn-primary w-full" @click="handleCreate" :disabled="validate.state.$invalid">
                        Oluştur
                      </button>
                    </div>


                  </div>
                </div>
              </div>
            </div>

            <div class="w-52 mx-auto xl:mr-0 xl:ml-6">
              <div class="border-2 border-dashed shadow-sm border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div class="h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                    <img class="object-fill	rounded-md" :alt="`${state.name}`" :src="state.newAvatarUrl != '' ? state.newAvatarUrl : state.defaultAvatar"  />

                </div>
                <div class="mx-auto cursor-pointer relative mt-5">
                  <button type="button" class="btn btn-primary w-full">
                    Avatarı Seç
                  </button>
                  <input type="file" class="w-full h-full top-0 left-0 absolute opacity-0" @change="onFileChange" />
                </div>
              </div>
            </div>




          </div>
        </div>
      </div>
      <!-- END: Kişisel Bilgiler -->
    </div>
  </div>
</template>

<script setup>

import {onMounted, reactive, computed} from "vue";
import BaseInput from '@/components/UI/BaseInput.vue';
import {email, minLength, required, sameAs} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import {useToast} from "vue-toastification";
import axios from "axios";
import GlobalHelper from "../../helpers/global";
import {useRouter} from "vue-router";
import { useMeta } from 'vue-meta'

const toast = useToast();
const router = useRouter();
useMeta({
  title: 'Yeni Kullanıcı',
  htmlAttrs: { lang: 'tr', amp: true }
})
const state = reactive({
  name : null,
  last_name:null,
  email:null,
  password:null,
  password_confirmation:null,
  roles:[],
  all_roles:[],
  avatar:'HK_avatar.jpg',
  newAvatarUrl:'',
  defaultAvatar:'/src/assets/images/error-illustration.svg',
})

const password = computed(() => state.password);

const rules = {
  state:{
    name: { required, minLength: minLength(2) },
    last_name:{ required, minLength: minLength(2) },
    email:{ required, minLength: minLength(4), email },
    password:{ required, minLength: minLength(6) },
    password_confirmation: {
      sameAsRef: sameAs(password), // can be passed a ref to compare
    },
    roles:{ required },
  }
}
const validate = useVuelidate(rules,{state});


const handleCreate = () => {
  axios.post('/admin/users',state)
    .then((response) => {
      if(response.status == 200){
        toast.success("Kullanıcı kaydı tamamlandı.");
        router.push('/users/list')
      }
    })
    .catch((error) => {
      if (error.response.status == 403) {
        router.push('/extras/unauthorized')
      }else if(error.response.status == 422){
        let errs = error.response.data.errors;
        let exps = GlobalHelper.QueryExceptionErrors(errs);
        let time =0;
        exps.map(exs=>{
          toast.error(exs,{timeout:3000+time});
          time +=500;
        })
      }else{
        toast.warning('Beklenmeyen bir hata oluştu.')
      }
    })
}


const onFileChange = (e) => {
  const file = e.target.files[0];
  state.newAvatarUrl = URL.createObjectURL(file);
  state.avatar = file;
}
const getAllRoles = () => {
  axios.get('/admin/role')
    .then((response) => {
      state.all_roles = response.data.data;
    })
    .catch((error) => {
      toast.warning('Kullanıcı rolleri alınırken bir hata oluştu.')
    });
}
onMounted(() => {
  getAllRoles();
})
</script>
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
                  <BaseInput label="İsim" id="isim" v-model="validate.state.userInfo.name.$model" :errors="validate.state.userInfo.name.$errors" />
                </div>


                <div class="col-span-6 2xl:col-span-6">
                  <BaseInput label="Soyisim" id="soyisim" v-model="validate.state.userInfo.last_name.$model" :errors="validate.state.userInfo.last_name.$errors" />
                </div>


                <div class="col-span-6 2xl:col-span-6 mt-3">
                  <BaseInput label="E-Posta" id="email" v-model="validate.state.userInfo.email.$model" :errors="validate.state.userInfo.email.$errors" />
                </div>
                <div class="col-span-6 2xl:col-span-6 mt-3">
                    <label for="rolsecimi" class="form-label">Rol Seçimi</label>
                    <TomSelect v-model="validate.state.userInfo.roles.$model" :options="{ placeholder: 'Kullanıcının rollerini seçiniz.' }" class="w-full" multiple>
                      <option :selected="role.has_role" :value="role.name" v-for="(role,index) in state.userInfo.all_roles" :key="index">{{role.name}}</option>
                    </TomSelect>
                    <div class="input-errors" v-for="(error, index) of validate.state.userInfo.roles.$errors" :key="index">
                      <small class="p-error">{{ error.$message }}</small>
                    </div>
                  </div>
              </div>


              <div class="flex flex-col-reverse xl:flex-row flex-col">
                <div class="flex-1 mt-6 xl:mt-0">
                  <div class="grid grid-cols-12 gap-x-5  mt-3">

                    <div class="col-span-6">
                      <button type="button" class="btn btn-primary w-full" @click="handleSubmit" :disabled="validate.state.userInfo.$invalid">
                        Güncelle
                      </button>
                    </div>

                    <div class="col-span-6">
                      <button @click="state.previewDialogModal = true" class="btn btn-danger-soft text-danger w-full flex">
                        <Trash2Icon class="w-4 h-4 mr-1" /> Hesabı Sil
                      </button>
                    </div>

                </div>
              </div>
            </div>
            </div>

            <div class="w-52 mx-auto xl:mr-0 xl:ml-6">
              <div class="border-2 border-dashed shadow-sm border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
                <div class="h-40 relative image-fit cursor-pointer zoom-in mx-auto">
                  <div v-if="state.userInfo.avatar != null">
                    <img class="object-fill	rounded-md" :alt="`${state.userInfo.name}`" :src="state.newAvatarUrl != '' ? state.newAvatarUrl : state.userInfo.avatar"  />
                  </div>
                  <div v-else>
                    <img class="object-fill	rounded-md" :alt="`${state.userInfo.name}`" :src="state.newAvatarUrl != '' ? state.newAvatarUrl : state.defaultAvatar"  />
                  </div>

                  <Tippy @click="onImageRemove" tag="div" content="Profil fotoğrafını silmek istediğinize emin misiniz?" class="w-5 h-5 flex items-center justify-center absolute rounded-full text-white bg-danger right-0 top-0 -mr-2 -mt-2" >
                    <xIcon class="w-4 h-4" />
                  </Tippy>
                </div>
                <div class="mx-auto cursor-pointer relative mt-5">
                  <button type="button" class="btn btn-primary w-full">
                    Avatarı Değiştir
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
  <DialogModal :show="state.previewDialogModal" :state="state" @dialogModalStatus="changeModalStatus" :processInfo="processInfo" />


</template>


<script setup>
import {required,minLength,email} from "@vuelidate/validators";
import {computed, onMounted, reactive} from "vue";
import '@vueform/multiselect/themes/default.css';
import axios from "axios";
import {useRouter} from "vue-router";
import DialogModal from '@/components/modals/DialogModal.vue';
import BaseInput from '@/components/UI/BaseInput.vue';
import {useVuelidate} from "@vuelidate/core";
import { useToast } from "vue-toastification";
import { useMeta } from 'vue-meta'
const router = useRouter();
const toast = useToast();


useMeta({
  title: 'Kullanıcı Detayı',
  htmlAttrs: { lang: 'tr', amp: true }
})


const props = defineProps({
  id: {type: String, required: true,},
})

const processInfo = reactive({
  title: 'Hesabı Sil',
  description: 'Kullanıcının hesabını silmek istediğinize emin misiniz?',
  buttonText: 'Hesabı Sil',
  proccess: 'delete',
  processUrl: '/admin/users/',
  processId: props.id,
})


const changeModalStatus = (e) => { state.previewDialogModal = e }

const state = reactive({
  userInfo: {},
  previewDialogModal: false,
  newAvatarUrl:'',
  defaultAvatar:'/src/assets/images/error-illustration.svg',
})


const rules = {
  state:{
    userInfo:{
      name: { required, minLength: minLength(2) },
      last_name:{ required, minLength: minLength(2) },
      email:{ required, minLength: minLength(4), email },
      roles:{ required },
    }
  }
}
const validate = useVuelidate(rules,{state});

const onFileChange = (e) => {
  const file = e.target.files[0];
  state.newAvatarUrl = URL.createObjectURL(file);

  let fileData = new FormData()
  fileData.append('avatar', file)
  fileData.append('_method', 'put')
  axios.post('/admin/users/'+props.id, fileData)
      .then((response) => {
        toast.success("Profil fotoğrafı değiştirildi.", {
          timeout: 3000
        });
      })
      .catch((error) => {
        toast.error("Profil fotoğrafı değiştirilemedi.", {
          timeout: 3000
        });
      })
}


const handleSubmit = () => {

  let formData = new FormData()
  formData.append('name', state.userInfo.name)
  formData.append('last_name', state.userInfo.last_name)
  formData.append('email', state.userInfo.email)
  formData.append('roles', state.userInfo.roles)
  formData.append('_method', 'put')
  axios.post('/admin/users/'+props.id, formData)
    .then((response) => {
      toast.success("Güncelleme başarılı", {
        timeout: 3000
      });

      setTimeout(
          function() {
            router.push('/users/list')
          }, 2000);

    })
    .catch((error) => {
      toast.error("Güncelleme başarısız", {
        timeout: 3000
      });
    })
}


const onImageRemove = () => {
  axios.post('/admin/users/'+props.id, {_method: 'put', avatar: 'HK_avatar.jpg'})
    .then((response) => {
      state.userInfo = response.data.data;
      toast.success("Profil fotoğrafı silindi.", {
        timeout: 3000
      });
    })
    .catch((error) => {
      toast.error("Profil fotoğrafı silinemedi.", {
        timeout: 3000
      });
    })
}


const getUser = () => {
  axios.get(`/admin/users/${props.id}`)
    .then((response) => {
      state.userInfo = response.data.data;
    })
    .catch((error) => {

      toast.error("Kullanıcı bilgilerine erişilemedi.", {
        timeout: 3000
      });

      setTimeout(
        function() {
          router.back()
        }, 2000);
    })
};



onMounted(() => {
  getUser();
})
</script>
<template>
  <Modal :show="isShow" @hidden="ModalStatusChange(false)">
    <ModalHeader>
      <div class="w-full">
      <h2 class="font-medium text-base mr-auto text-center" v-if="props.roleId">Rol Güncelleme</h2>
      <h2 class="font-medium text-base mr-auto text-center" v-else>Yeni Rol Oluşturma</h2>
      </div>
    </ModalHeader>
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">



      <div class="col-span-12">
        <BaseInput label="Rol Adı" id="rolename" v-model="validate.role.name.$model" :errors="validate.role.name.$errors" />
      </div>

    </ModalBody>
    <ModalFooter>
      <button type="button" @click="ModalStatusChange(false)" class="btn btn-outline-secondary w-20 mr-1">İptal</button>
      <button type="button" class="btn btn-primary w-20" @click="handleUpdate" :disabled="validate.role.$invalid" v-if="roleId">Güncelle</button>
      <button type="button" class="btn btn-primary w-20" @click="handleSave" :disabled="validate.role.$invalid" v-else>Kaydet</button>
    </ModalFooter>
  </Modal>
</template>

<script setup>
import {onMounted, reactive,watch} from 'vue'
import BaseInput from "@/components/UI/BaseInput.vue";
import {minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import axios from "axios";
import GlobalHelper from "@/helpers/global";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
const toast = useToast();
const router = useRouter();


const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
  },
  roleId: {
    type: Number,
    required: false,
  },
});
watch(() => props.roleId, (value) => {
  if (value) {
    getRoleDetail();
  }else{
    role.name = null;
    role.guard_name = null;
    role.permissions = [];
  }
});

const role = reactive({
  name: null,
  guard_name: 'api',
  permissions: [],
});

const rules = {
  role:{
    name: { required, minLength: minLength(2) }
  }
}
const validate = useVuelidate(rules,{role});

const handleSave = () => {
  axios.post('/admin/role', role)
    .then((response) => {
      toast.success('Rol sisteme eklendi.');
      UpdateRoleList();
      ModalStatusChange(false);
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


const handleUpdate = () => {
  delete role.permissions;
  axios.put('/admin/role/'+props.roleId, role)
    .then((response) => {
      toast.success('Rol güncellendi.');
      UpdateRoleList();
      ModalStatusChange(false);
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


const emit= defineEmits(["setModalPreview","getAllRoles"])

const ModalStatusChange = (stat) => {
  emit("setModalPreview", stat);
}
const UpdateRoleList = () => {
  emit("getAllRoles");
}
const getRoleDetail = () => {
  axios.get('/admin/role/'+props.roleId)
    .then((response) => {
      role.name = response.data.data.role.name;
      role.guard_name = response.data.data.role.guard_name;
      role.permissions = response.data.data.all_permissions;
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
onMounted(() => {
  if(props.roleId){
    getRoleDetail();
  }
});

</script>
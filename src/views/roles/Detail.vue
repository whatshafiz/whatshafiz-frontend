<template>
  <TabGroup class="intro-y box col-span-12 2xl:col-span-6 mt-3 md:mt-4">
    <div class="flex items-center px-5 py-5 sm:py-0 border-b border-slate-200/60 dark:border-darkmode-400">
      <h2 class="font-bold text-base mr-auto">{{ state.roleDetail.name }}</h2>
      <TabList class="nav-link-tabs w-auto ml-auto hidden sm:flex">
        <Tab :fullWidth="false" class="py-5 cursor-pointer" v-for="(group,index) in state.allPermissions" :key="index">{{ index }}</Tab>
      </TabList>
    </div>
    <div class="p-5">
      <TabPanels>
        <TabPanel v-for="(group,index) in state.allPermissions">
          <div class="flex items-center mt-5"  v-for="(permission,perindex) in group" :key="perindex">
            <div class="border-l-2 border-primary dark:border-primary pl-4">
              <p class="font-medium">{{ permission.description }}</p>
              <div class="text-slate-500">{{ permission.guard_name }}</div>
            </div>
            <div class="form-check form-switch ml-auto">
              <input class="form-check-input" :id="permission.name" v-model="state.allPermissions[index][perindex].check" type="checkbox" />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </div>
  </TabGroup>

  <div class="grid grid-cols-6 gap-4 mt-4">
    <div class="col-span-6 sm:col-span-5">
      <button class="btn btn-secondary w-full" @click="handleUpdateRoles">Güncelle</button>
    </div>
    <div class="col-span-6 md:col-auto">
      <button @click="state.previewDialogModal = true" class="btn btn-outline-danger w-full hover:bg-amber-400">
        Rolü Sil
      </button>
    </div>
    <DialogModal :show="state.previewDialogModal" :state="state" @dialogModalStatus="changeModalStatus" :processInfo="processInfo" />

  </div>
</template>

<script setup>
import axios from "axios";
import {onMounted, reactive} from "vue";
import {useRouter} from "vue-router";
import GlobalHelper from "../../helpers/global";
import {useToast} from "vue-toastification";
import {useMeta} from "vue-meta";
const toast = useToast();
import DialogModal from '@/components/modals/DialogModal.vue';
const router = useRouter();


const changeModalStatus = (e) => { state.previewDialogModal = e }


useMeta({
  title: 'Rol Detayı',
  htmlAttrs: { lang: 'tr', amp: true }
});

const processInfo = reactive({
  title: 'Rolü Sil',
  description: 'Rolü silmek istediğinize emin misiniz?',
  buttonText: 'Rolü Sil',
  proccess: 'delete',
  processUrl: '/admin/role/',
  processId: props.id,
})




const props = defineProps({
  id: {type: String, required: true},
})

const state = reactive({
  permissionGroups: [],
  allPermissions: [],
  permissions: [],
  roleDetail:{},
  checkedRoles: [],
  previewDialogModal: false,
});

const handleUpdateRoles = async () => {
  let formData = new FormData();
  formData.append("name", state.roleDetail.name);
  formData.append("guard_name", state.roleDetail.guard_name);
  formData.append("permissions", JSON.stringify(state.allPermissions));
  formData.append("_method", "PUT");
  axios.post('admin/role/'+props.id,formData)
    .then((response) => {
      toast.success('Rol izinleri başarıyla güncellendi');
    })
    .catch((error) => {
      toast.error('Rol izinleri başarıyla güncellendi');
    });
}
const getRoleDetail = async () => {
  await axios.get("/admin/role/"+props.id).then(
      (response) => {
        state.roleDetail = response.data.data.role;
        state.allPermissions = GlobalHelper.groupBy(response.data.data.all_permissions, 'controller_group');
      }
  ).catch((error) => {
    console.log(error);
  });
};

onMounted(() => {
  getRoleDetail();
});
</script>
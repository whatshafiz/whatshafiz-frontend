<template>
  <h2 class="intro-y text-lg font-medium mt-10">Kullanıcı Rolleri</h2>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
      <button class="btn btn-primary shadow-md mr-2" @click="setModalPreview(true,null)">Yeni Rol Oluştur</button>
    </div>
    <div v-for="(role, index) in state.allRoles" :key="index" class="intro-y col-span-12 md:col-span-6 lg:col-span-4">
      <div class="box">
        <div class="flex items-start px-5 pt-5">
          <div class="w-full flex flex-col lg:flex-row items-center">
            <div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
              <a href="" class="font-medium">{{ role.name }}</a>
              <div class="text-slate-500 text-xs mt-2 mb-8">
                Guard: {{ role.guard_name }}
              </div>
            </div>
          </div>
          <Dropdown class="absolute right-0 top-0 mr-5 mt-3">
            <DropdownToggle tag="a" class="w-5 h-5 block" href="javascript:;">
              <MoreHorizontalIcon class="w-5 h-5 text-slate-500" />
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem @click="router.push('/roles/'+role.id)">
                  <UnlockIcon class="w-4 h-4 mr-2" /> İzinleri Değiştir
                </DropdownItem>
                <DropdownItem  @click="setModalPreview(true,role.id)">
                    <Edit3Icon class="w-4 h-4 mr-2" /> İsmi Güncelle
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>

      </div>
    </div>
    <!-- END: Users Layout -->
    <FormModal :isShow="modalPreview.isShow" @getAllRoles="getAllRoles" :roleId="modalPreview.roleId" @setModalPreview="setModalPreview"  />
  </div>
</template>


<script setup>
import {onMounted,ref, reactive} from "vue";
import axios from "axios";
import FormModal from "@/components/modals/Role/FormModal.vue";
import {useRouter} from "vue-router";
import { useMeta } from 'vue-meta'

useMeta({
  title: 'Rol Listesi',
  htmlAttrs: { lang: 'tr', amp: true }
})
const router = useRouter();
const modalPreview = reactive(
    {
      isShow: false,
      roleId: null,
    }
);


const setModalPreview = (status,id=false) => {
  modalPreview.isShow = status;
  if (id) {
    modalPreview.roleId = id;
  }else{
    modalPreview.roleId = null;
  }
}

const state = reactive({
  allRoles : [],
})

const getAllRoles = async () => {
  await axios.get('/admin/role')
      .then((response) => {
        state.allRoles = response.data.data
      })
      .catch((error) => {
        console.log(error)
      })
}
onMounted(() => {
  getAllRoles()
})
</script>
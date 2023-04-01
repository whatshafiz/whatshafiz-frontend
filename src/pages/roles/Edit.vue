<script setup lang="ts">
import { FormLabel, FormInput, FormSwitch } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import { ref, reactive, onMounted, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { usePermissionStore } from "@/stores/permission"
import { useRoleStore } from "@/stores/role"

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const roleStore = useRoleStore()
const permissionStore = usePermissionStore()
const roleId = route.params.roleId
const role = reactive({
  name: '',
  permissions: [],
})

onMounted(async () => {
  await permissionStore.fetchPermissions()
  const roleData = await roleStore.fetchRole(roleId)
  role.name = roleData.name
  role.permissions = roleData.permissions.map(permission => permission.id)
})

const selectPermission = (permissionId) => {
  const index = role.permissions.indexOf(permissionId);

  if (index > -1) {
    role.permissions.splice(index, 1)
  } else {
    role.permissions.push(permissionId)
  }
}

const onSubmit = async () => {
  isLoading.value = true

  try {
    await roleStore.updateRole(roleId, role)
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Rol bilgileri güncellendi.')
    router.push({ name: 'roles.index' })
  } catch (response) {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
};

</script>

<template>
  <div v-if="user.hasRole('Admin')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Rol Bilgilerini Düzenle</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Rol Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Rol Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="role.name" :value="role.name" type="text" name="name"
                  placeholder="Rol Adı Yazın" />
              </div>
              <div class="mt-3">
                <label>Rol Yetkilerini Belirleyin</label>
                <div class="mt-2" v-for="(permission, key) in permissionStore.getPermissions">
                  <FormSwitch>
                    <FormSwitch.Input :id="'checkbox-switch-' + key" type="checkbox" :value="permission.id"
                      :checked="role.permissions.includes(permission.id)"
                      @click="() => { selectPermission(permission.id) }" />
                    <FormSwitch.Label :htmlFor="'checkbox-switch-' + key">
                      {{ permission.name }}
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>

              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <RouterLink :to="{ name: 'roles.index' }">
                <Button variant="outline-secondary" type="button" class="mt-5 mr-5">
                  İptal
                </Button>
              </RouterLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

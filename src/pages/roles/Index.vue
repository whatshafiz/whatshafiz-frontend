<script setup lang="ts">
import Button from "@/base-components/Button";
import Datatable from "@/components/Datatable";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useRoleStore } from "@/stores/role";
import { useAlertStore } from "@/stores/alert";

interface Response {
  name?: string;
  users_count?: number;
}

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref();

const alertStore = useAlertStore()
const router = useRouter()
const user = useUserStore()
const roleStore = useRoleStore()

const deleteRole = async (roleId) => {
  if (await roleStore.deleteRole(roleId)) {
    successNotificationToggle('İşlem Başarılı', 'Rol Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Rol Silinemedi!')
  }
}

const tableColumns = [
  {
    title: "",
    formatter: "responsiveCollapse",
    width: 40,
    minWidth: 30,
    hozAlign: "center",
    resizable: false,
    headerSort: false,
  },

  // For HTML table
  {
    title: "ID",
    width: 70,
    responsive: 0,
    field: "id",
    vertAlign: "middle",
  },
  {
    title: "ROL ADI",
    minWidth: 100,
    responsive: 1,
    field: "name",
    vertAlign: "middle",
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div>
                <div class="font-medium whitespace-nowrap">${response.name}</div>
                <div class="text-xs text-slate-500 whitespace-nowrap">Kullanıcı Sayısı: ${response.users_count}</div>
              </div>`;
    },
  },
  {
    title: "İŞLEMLER",
    width: 200,
    field: "actions",
    responsive: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const editButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                                <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Düzenle
                            </a>`);
      const deleteButton =
        stringToHTML(`<a class="flex items-center text-danger" href="javascript:;">
                            <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Sil
                            </a>`);

      editButton.addEventListener("click", function () {
        router.push({ name: 'roles.edit', params: { roleId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteRole(rowData.id))
      });

      if (user.can('roles.update')) {
        buttonsHolder.append(editButton)
      }

      if (user.can('roles.delete')) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('roles.update')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Rol ve Yetki Yönetimi</h2>
      <div v-if="user.can('roles.create')" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'roles.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Rol Ekle
          </Button>
        </RouterLink>
      </div>
    </div>

    <datatable ref="tableRef" :index-url="roleStore.getIndexURL" :columns="tableColumns" />
  </div>
</template>

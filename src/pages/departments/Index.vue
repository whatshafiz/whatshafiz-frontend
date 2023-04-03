<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useUniversityStore } from "@/stores/university";
import { useAlertStore } from "@/stores/alert";

interface Response {
  name?: string;
}

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref();

const alertStore = useAlertStore()
const router = useRouter()
const user = useUserStore()
const universityStore = useUniversityStore()

const deleteDepartment = async (departmentId) => {
  if (await universityStore.deleteDepartment(departmentId)) {
    successNotificationToggle('İşlem Başarılı', 'Bölüm Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Bölüm Silinemedi!')
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
    title: "Bölüm",
    minWidth: 200,
    responsive: 1,
    field: "name",
    vertAlign: "middle",
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div>
        <div class="font-medium whitespace-nowrap">${response.name}</div>
        <div class="text-xs text-slate-500 whitespace-nowrap">${response.university.name} - ${response.faculty.name}</div>
      </div>`;
    },
  },
  {
    title: "Kullanıcı Sayısı",
    minWidth: 50,
    responsive: 2,
    field: "users_count",
    vertAlign: "middle",
  },
  {
    title: "İŞLEMLER",
    width: 150,
    field: "actions",
    responsive: 4,
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
        router.push({ name: 'departments.edit', params: { departmentId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteDepartment(rowData.id))
      });

      if (user.can('universities.update')) {
        buttonsHolder.append(editButton)
      }

      if (user.can('universities.delete')) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('universities.update')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Tüm Bölümler</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'departments.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Üniversite Bölümü Ekle
          </Button>
        </RouterLink>
      </div>
    </div>

    <datatable ref="tableRef" :index-url="universityStore.getDepartmentsIndexURL" :columns="tableColumns" />
  </div>
</template>

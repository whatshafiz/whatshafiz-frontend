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

const deleteFaculty = async (facultyId) => {
  if (await universityStore.deleteFaculty(facultyId)) {
    successNotificationToggle('İşlem Başarılı', 'Fakülte Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Fakülte Silinemedi!')
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
    title: "Fakülte",
    minWidth: 200,
    responsive: 1,
    field: "name",
    vertAlign: "middle",
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div>
        <div class="font-medium whitespace-nowrap">${response.name}</div>
        <div class="text-xs text-slate-500 whitespace-nowrap">${response.university.name}</div>
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
    title: "Bölüm Sayısı",
    minWidth: 50,
    responsive: 3,
    field: "departments_count",
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
        router.push({ name: 'faculties.edit', params: { facultyId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteFaculty(rowData.id))
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
      <h2 class="mr-auto text-lg font-medium">Fakülteler</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'faculties.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Fakülte Ekle
          </Button>
        </RouterLink>
      </div>
    </div>

    <datatable ref="tableRef" :index-url="universityStore.getFacultiesIndexURL" :columns="tableColumns" />
  </div>
</template>

<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useRegulationStore } from "@/stores/regulation";
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
const regulationStore = useRegulationStore()

console.log()

const deleteregulation = async (regulationId) => {
  if (await regulationStore.deleteregulation(regulationId)) {
    successNotificationToggle('İşlem Başarılı', 'Yönetmelik Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Yönetmelik Silinemedi!')
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
    title: "Yönetmelik Adı",
    minWidth: 100,
    responsive: 1,
    field: "name",
    vertAlign: "middle",
  },
  {
    title: "Kurs Türü",
    width: 250,
    minWidth: 100,
    responsive: 2,
    field: "course_type.name",
    vertAlign: "middle",
    headerSort: false
  },
  {
    title: "İŞLEMLER",
    width: 250,
    field: "actions",
    responsive: 4,
    hozAlign: "center",
    headerHozAlign: "center",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const showButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                                <i data-lucide="eye" class="w-4 h-4 mr-1"></i> Görüntüle
                            </a>`);
      const editButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                                <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Düzenle
                            </a>`);
      const deleteButton =
        stringToHTML(`<a class="flex items-center text-danger" href="javascript:;">
                            <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Sil
                            </a>`);

      showButton.addEventListener("click", function () {
        router.push({ name: 'regulations.view', params: { regulationId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'regulations.edit', params: { regulationId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteregulation(rowData.id))
      });

      buttonsHolder.append(showButton)

      if (user.hasRole('Admin')) {
        buttonsHolder.append(editButton)
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.hasRole('Admin')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Yönetmelikler</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'regulations.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Yönetmelik Ekle
          </Button>
        </RouterLink>
      </div>
    </div>

    <datatable ref="tableRef" :index-url="regulationStore.getIndexURL" :columns="tableColumns" />
  </div>
</template>

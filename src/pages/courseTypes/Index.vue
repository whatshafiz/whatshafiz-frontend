<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useCourseTypeStore } from "@/stores/courseType";
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
const courseTypeStore = useCourseTypeStore()

console.log()

const deleteCourseType = async (courseTypeId) => {
  if (await courseTypeStore.deleteCourseType(courseTypeId)) {
    successNotificationToggle('İşlem Başarılı', 'Kurs Türü Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Kurs Türü Silinemedi!')
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
    title: "Kurs Türü",
    minWidth: 200,
    responsive: 2,
    field: "name",
    vertAlign: "middle",
    formatter(cell) {
      const rowData = cell.getData()

      if (rowData.parent_id === null) {
        return `<div class=ont-medium whitespace-nowrap">${rowData.name}</div>`;
      }

      return `<div>
          <div class=ont-medium whitespace-nowrap">${rowData.name}</div>
          <div class="text-xs text-slate-500 whitespace-nowrap">Ana Kurs Türü: ${rowData.parent.name}</div>
          </div>
          `;
    }
  },
  {
    title: "Yönetmelik",
    width: 230,
    responsive: 3,
    field: "regulation.name",
    vertAlign: "middle",
    formatter(cell) {
      const rowData = cell.getData()

      if (rowData.regulation.name === null) {
        if (user.can('regulations.create')) {
          const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
          const cerateButton =
            stringToHTML(`<a class="flex items-center mr-3 text-success" href="javascript:;">
                                <i data-lucide="file-plus" class="w-4 h-4 mr-1"></i> Oluştur
                            </a>`);
          cerateButton.addEventListener("click", function () {
            router.push({ name: 'regulations.create', query: { courseTypeId: rowData.id } })
          });
          buttonsHolder.append(cerateButton)

          return buttonsHolder
        }

        return 'YOK'
      }

      return rowData.regulation.name
    }
  },
  {
    title: "Kurs Sayısı",
    width: 140,
    responsive: 4,
    field: "courses_count",
    vertAlign: "middle",
  },
  {
    title: "Whatsapp Grup Sayısı",
    width: 200,
    responsive: 5,
    field: "whatsapp_groups_count",
    vertAlign: "middle",
  },
  {
    title: "Toplam Başvuru Sayısı",
    width: 200,
    responsive: 6,
    field: "total_users_count",
    vertAlign: "middle",
  },
  {
    title: "Aktif Kullanıcı Sayısı",
    width: 190,
    responsive: 7,
    field: "active_users_count",
    vertAlign: "middle",
  },
  {
    title: "Yorum Sayısı",
    width: 150,
    responsive: 8,
    field: "comments_count",
    vertAlign: "middle",
  },
  {
    title: "İŞLEMLER",
    width: 200,
    field: "actions",
    responsive: 10,
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
        router.push({ name: 'courseTypes.view', params: { courseTypeId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'courseTypes.edit', params: { courseTypeId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteCourseType(rowData.id))
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
      <h2 class="mr-auto text-lg font-medium">Kurs Türleri</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'courseTypes.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Kurs Türü Ekle
          </Button>
        </RouterLink>
      </div>
    </div>

    <datatable ref="tableRef" :index-url="courseTypeStore.getIndexURL" :columns="tableColumns" />
  </div>
</template>

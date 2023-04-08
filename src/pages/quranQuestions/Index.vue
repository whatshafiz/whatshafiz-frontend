<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useQuranQuestionStore } from "@/stores/quranQuestion";
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
const quranQuestionStore = useQuranQuestionStore()

const deleteQuranQuestion = async (quranQuestionId) => {
  if (await quranQuestionStore.deleteQuranQuestion(quranQuestionId)) {
    successNotificationToggle('İşlem Başarılı', 'Meal Sorusu Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Meal Sorusu Silinemedi!')
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
    title: "Soru Sayfası",
    responsive: 1,
    field: "page_number",
    vertAlign: "middle",
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div>
        <div class="font-medium whitespace-nowrap">${response.page_number}</div>
        <div class="text-xs text-slate-500 whitespace-nowrap">${response.question}</div>
      </div>`;
    },
  },
  {
    title: "İŞLEMLER",
    width: 230,
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
        stringToHTML(`<a class="flex items-center mr-3 text-primary" href="javascript:;">
                                <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Düzenle
                            </a>`);
      const deleteButton =
        stringToHTML(`<a class="flex items-center text-danger" href="javascript:;">
                            <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Sil
                            </a>`);

      showButton.addEventListener("click", function () {
        router.push({ name: 'quranQuestions.view', params: { quranQuestionId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'quranQuestions.edit', params: { quranQuestionId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteQuranQuestion(rowData.id))
      });

      if (user.can('quranQuestions.view')) {
        buttonsHolder.append(showButton)
      }

      if (user.can('quranQuestions.update')) {
        buttonsHolder.append(editButton)
      }

      if (user.can('quranQuestions.delete')) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('quranQuestions.list')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Meal Soruları</h2>
      <div v-if="user.can('quranQuestions.create')" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'quranQuestions.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Meal Sorusu Ekle
          </Button>
        </RouterLink>
      </div>
    </div>
    <datatable ref="tableRef" :index-url="quranQuestionStore.getIndexURL" :columns="tableColumns" />
  </div>
</template>

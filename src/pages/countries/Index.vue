<script setup lang="ts">
import Datatable from "@/components/Datatable";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useCountryStore } from "@/stores/country";
import { useAlertStore } from "@/stores/alert";

interface Response {
  iso?: string;
  name?: string;
  phone_code?: string;
}

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref();

const alertStore = useAlertStore()
const router = useRouter()
const user = useUserStore()
const countryStore = useCountryStore()

const deleteCountry = async (countryId) => {
  if (await countryStore.deleteCountry(countryId)) {
    successNotificationToggle('İşlem Başarılı', 'Ülke Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Ülke Silinemedi!')
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
    title: "Ülke",
    minWidth: 150,
    responsive: 1,
    field: "name",
    vertAlign: "middle",
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div>
                <div class="font-medium whitespace-nowrap">${response.name}</div>
                <div class="text-xs text-slate-500 whitespace-nowrap">ISO: ${response.iso} | Kod: ${response.phone_code}</div>
              </div>`;
    },
  },
  {
    title: "Şehir Sayısı",
    minWidth: 70,
    responsive: 2,
    field: "cities_count",
    vertAlign: "middle",
  },
  {
    title: "Kullanıcı Sayısı",
    minWidth: 50,
    responsive: 3,
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
        router.push({ name: 'countries.edit', params: { countryId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteCountry(rowData.id))
      });

      if (user.can('countries.update')) {
        buttonsHolder.append(editButton)
      }

      if (user.can('countries.delete')) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('countries.update')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Ülkeler</h2>
    </div>

    <datatable
      ref="tableRef"
      :index-url="countryStore.getIndexURL"
      :columns="tableColumns"
      :initial-sort="{ column: 'id', dir: 'asc' }"
    />
  </div>
</template>

<script setup lang="ts">
import Datatable from "@/components/Datatable";
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useSettingStore } from "@/stores/setting";

interface Response {
  name?: string;
  value?: string;
}

const tableRef = ref();

const router = useRouter()
const user = useUserStore()
const settingStore = useSettingStore()

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
    title: "AD",
    minWidth: 400,
    responsive: 1,
    field: "name",
    vertAlign: "middle",
  },
  {
    title: "DEĞER",
    minWidth: 100,
    responsive: 1,
    field: "value",
    vertAlign: "middle",
  },
  {
    title: "İŞLEMLER",
    width: 150,
    field: "actions",
    responsive: 2,
    hozAlign: "center",
    headerHozAlign: "center",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      if (!user.hasRole('Admin')) {
        return ''
      }

      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const editButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                          <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Düzenle
                      </a>`);

      editButton.addEventListener("click", function () {
        router.push({ name: 'settings.edit', params: { settingId: rowData.id } })
      });

      buttonsHolder.append(editButton)

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.hasRole('Admin')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Sistem Ayarları</h2>
    </div>

    <datatable ref="tableRef" :index-url="settingStore.getIndexURL" :columns="tableColumns" />
  </div>
</template>

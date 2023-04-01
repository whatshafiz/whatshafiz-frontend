<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createIcons, icons } from "lucide";
import { TabulatorFull as Tabulator } from "tabulator-tables";

const props = defineProps({
  columns: Array,
  indexUrl: String,
})

const tableRef = ref<HTMLDivElement>();
const tabulator = ref<Tabulator>();

const initTabulator = () => {
  if (tableRef.value) {
    tabulator.value = new Tabulator(tableRef.value, {
      ajaxURL: props.indexUrl,
      ajaxConfig: {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      },
      paginationMode: "remote",
      filterMode: "remote",
      sortMode: "remote",
      printAsHtml: false,
      printStyled: false,
      pagination: true,
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 30, 40, 100],
      layout: "fitColumns",
      responsiveLayout: "collapse",
      placeholder: "Kayıt Bulunamadı",
      responsiveLayoutCollapseStartOpen: false,
      selectable: false,
      initialSort: [
        { column: "id", dir: "desc" },
      ],
      columns: props.columns,
    });
  }

  tabulator.value?.on("renderComplete", () => {
    createIcons({
      icons,
      attrs: {
        "stroke-width": 1.5,
      },
      nameAttr: "data-lucide",
    });
  });
};

// Redraw table onresize
const reInitOnResizeWindow = () => {
  window.addEventListener("resize", () => {
    if (tabulator.value) {
      tabulator.value.redraw();
      createIcons({
        icons,
        attrs: {
          "stroke-width": 1.5,
        },
        nameAttr: "data-lucide",
      });
    }
  });
};

const refreshData = () => {
  if (tabulator.value) {
    tabulator.value.replaceData();
  }
}

defineExpose({ refreshData })

onMounted(() => {
  initTabulator();
  reInitOnResizeWindow();
});
</script>

<template>
  <div class="p-5 mt-5 intro-y box">
    <div class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" ref="tableRef" class="mt-5"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { createIcons, icons } from "lucide";
import Button from "@/base-components/Button";
import { FormInput } from "@/base-components/Form";
import { TabulatorFull as Tabulator } from "tabulator-tables";

const props = defineProps({
  columns: Array,
  indexUrl: String,
  initialSort: { type: Object, required: false, default: { column: "id", dir: "desc" } },
  filters: { type: Object, required: false, default: null },
})

const tableRef = ref<HTMLDivElement>();
const tabulator = ref<Tabulator>();
const filter = reactive({
  field: "search",
  type: '=',
  value: '',
});
const setFilter = (value: typeof filter) => {
  Object.assign(filter, value);
};
const onFilter = () => {
  if (tabulator.value) {
    tabulator.value.setFilter(filter.field, filter.type, filter.value);
  }
};
const onResetFilter = () => {
  filter.value = ''
  onFilter()
};

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
        props.initialSort,
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
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <form
        id="tabulator-html-filter-form"
        class="xl:flex sm:mr-auto"
        @submit="
          (e) => {
            e.preventDefault();
            onFilter();
          }
        "
      >
        <div class="items-center mt-2 sm:flex sm:mr-4 xl:mt-0">
          <FormInput
            id="tabulator-html-filter-value"
            v-model="filter.value"
            :value="filter.value"
            type="text"
            class="mt-2 sm:w-80 sm:mt-0"
            placeholder="Arama Yap..."
          />
        </div>
        <div class="mt-2 xl:mt-0">
          <Button
            id="tabulator-html-filter-go"
            variant="primary"
            type="button"
            class="w-full sm:w-16"
            @click="onFilter"
          >
            Ara
          </Button>
          <Button
            id="tabulator-html-filter-reset"
            variant="secondary"
            type="button"
            class="w-full mt-2 sm:w-16 sm:mt-0 sm:ml-1"
            @click="onResetFilter"
          >
            İptal
          </Button>
        </div>
      </form>
    </div>
    <div class="overflow-x-auto scrollbar-hidden">
      <div id="tabulator" ref="tableRef" class="mt-5"></div>
    </div>
  </div>
</template>

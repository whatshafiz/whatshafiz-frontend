<template>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Kullanıcı Listesi</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <router-link to="/users/create" class="btn btn-primary shadow-md mr-2">Yeni Kullanıcı Ekle</router-link>
    </div>
  </div>
  <div class="intro-y box p-5 mt-5">
    <div class="flex flex-col sm:flex-row sm:items-end xl:items-start">
      <div id="tabulator-html-filter-form" class="xl:flex sm:mr-auto">
        <div class="sm:flex items-center sm:mr-4">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Alan</label>
          <select id="tabulator-html-filter-field" v-model="filter.field" class="form-select w-full sm:w-32 2xl:w-full mt-2 sm:mt-0 sm:w-auto">
            <option value="name">İsim</option>
            <option value="last_name">Soyisim</option>
            <option value="email">E-Posta</option>
          </select>
        </div>
        <div class="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
          <label class="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Değer</label>
          <input id="tabulator-html-filter-value" v-model="filter.value" type="text" class="form-control sm:w-40 2xl:w-full mt-2 sm:mt-0" placeholder="Değer giriniz"/>
        </div>
        <div class="mt-2 xl:mt-0">
          <button id="tabulator-html-filter-go" type="button" class="btn btn-primary w-full sm:w-16" @click="onFilter">
            Ara
          </button>
          <button id="tabulator-html-filter-reset" type="button" class="btn btn-secondary w-full sm:w-16 mt-2 sm:mt-0 sm:ml-1" @click="onResetFilter">
            Temizle
          </button>
        </div>
      </div>
      <div class="flex mt-5 sm:mt-0">
        <button
          id="tabulator-print"
          class="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"
          @click="onPrint"
        >
          <PrinterIcon class="w-4 h-4 mr-2" /> 
        </button>
        <Dropdown class="w-1/2 sm:w-auto">
          <DropdownToggle class="btn btn-outline-secondary w-full sm:w-auto">
            <FileTextIcon class="w-4 h-4 mr-2" /> Dışarı Aktar
            <ChevronDownIcon class="w-4 h-4 ml-auto sm:ml-2" />
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem @click="onExportCsv">
                <FileTextIcon class="w-4 h-4 mr-2" /> CSV
              </DropdownItem>
              <DropdownItem @click="onExportJson">
                <FileTextIcon class="w-4 h-4 mr-2" /> JSON
              </DropdownItem>
              <DropdownItem @click="onExportXlsx">
                <FileTextIcon class="w-4 h-4 mr-2" /> XLSX
              </DropdownItem>
              <DropdownItem @click="onExportHtml">
                <FileTextIcon class="w-4 h-4 mr-2" /> HTML
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>


 
    <div class="overflow-x-auto scrollbar-hidden">
      <div
        id="tabulator"
        ref="tableRef"
        class="mt-5 table-report table-report--tabulator"
      ></div>
    </div>
  </div>
  <!-- END: HTML Table Data -->
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { createIcons, icons } from "lucide";
import Tabulator from "tabulator-tables";
import dom from "@left4code/tw-starter/dist/js/dom";
import xlsx from "xlsx";
import axios from "axios";
import router from "@/router";
import { useMeta } from 'vue-meta'


useMeta({
  title: 'Kullanıcı Listesi',
  htmlAttrs: { lang: 'tr', amp: true }
})

const tableRef = ref();
const tabulator = ref();
const filter = reactive({
  field: "name",
  value: "",
});
const userList = reactive({
  users:[],
});

/*
const initUserList = () => {
  axios.get("/admin/users").then((response) => {
    userList.users = response.data.data.data
  });
}
*/
 
const initTabulator = () => {
  tabulator.value = new Tabulator(tableRef.value, {
    //data: userList.users,
    locale: "tr_TR",
    langs: {
      "tr_TR": {
        "pagination": {
          "page_title": "Sayfa Başlığı",
          "page_size":"Gösterim Sayısı",
        },
        "ajax":{
          "loading":"Yükleniyor",
          "error":"Hata",
        },
      },
      },
    reactiveData:true,
    ajaxFiltering: true,
    ajaxSorting: true,
    printAsHtml: true,
    printStyled: true,
    pagination: "remote",
    paginationSize: 20,
    paginationSizeSelector: [10, 20, 30, 40],
    placeholder: "Henüz bir kayıt yok...",
    responsiveLayout: "collapse",
    layout: "fitColumns",
    ajaxURL: "https://api.letssign.tk/api/v1/admin/users",
    ajaxConfig:{
    method:"GET", 
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          'X-Requested-With': 'XMLHttpRequest'
      },
    },
    ajaxResponse: function (url, params, response) {
      // Must configure with server side
      let last_page = response.data.last_page;
      let data = response.data.data;

      return {data,last_page};
    },
    ajaxURLGenerator: function (url, config, params) {
      const { page, size } = params;

      let sendFilter = "";
      if (filter.value) {
        sendFilter += `&filter[${filter.field}]=${filter.value}`;
      }

      if (params.sorters.length > 0) {
        const { field, dir } = params.sorters[0];
        if(dir == 'desc'){
          sendFilter += `&sort=-${field}`;
        }else if(dir == 'asc'){
          sendFilter += `&sort=${field}`;
        }
        return `${url}?page=${page}&size=${size}` + sendFilter;
      } else {
          return `${url}?page=${page}&size=${params.size}` + sendFilter;
      }


    },
    columns: [
      {
        title: "A/P",
        width: "7%",
        hozAlign: "center",
        vertAlign: "middle",
        field: "is_active",
        headerSort: false,
        formatter(cell) {
          return `<div class="flex justify-center">
                    <div class="form-check form-switch">
                      <input class="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckChecked" ${
              cell.getData().is_active ? "checked" : ""
          }>
                    </div>
                  </div>`;
        },
        cellClick:function(e, cell){
          let userInfo = cell.getData();
          let userId = userInfo.id;
          let isActive = e.target.checked ? 1 : 0;
          let formData = new FormData();
          formData.append('is_active', isActive);
          formData.append('_method', 'put');
          axios.post("/admin/users/"+userId,formData).then((response) => {
            console.log(response.data);
          });
        },
      },
      {
        title: "İsim",
        minWidth: 200,
        responsive: 0,
        field: "name",
        hozAlign: "left",
        vertAlign: "middle",
      },
      {
        title: "Soyisim",
        minWidth: 200,
        responsive: 0,
        field: "last_name",
        hozAlign: "left",
        vertAlign: "middle",
      },
      {
        title: "E-Posta",
        minWidth: 200,
        field: "email",
        hozAlign: "left",
        vertAlign: "middle",
      },
      {
        title: "Durum",
        minWidth: 200,
        field: "is_active",
        hozAlign: "right",
        vertAlign: "middle",
        headerSort: false,
        formatter(cell) {
          return `<button class="btn btn-sm btn-primary w-24 mr-1 mb-2">
                    Düzenle
                </button>`;
        },
        cellClick:function(e, cell){
          let userInfo = cell.getData();
          let userId = userInfo.id;
          router.push('/users/'+userId);
        },
      },
 
    ],
  });
};


const reInitOnResizeWindow = () => {
  window.addEventListener("resize", () => {
    tabulator.value.redraw();
    createIcons({
      icons,
      "stroke-width": 1.5,
      nameAttr: "data-lucide",
    });
  });
};

// Filter function
const onFilter = () => {
  tabulator.value.setFilter(filter.field, filter.value);
};

// On reset filter
const onResetFilter = () => {
  filter.field = "name";
  filter.value = "";
  onFilter();
};

// Export
const onExportCsv = () => {
  tabulator.value.download("csv", "data.csv");
};

const onExportJson = () => {
  tabulator.value.download("json", "data.json");
};

const onExportXlsx = () => {
  const win = window;
  win.XLSX = xlsx;
  tabulator.value.download("xlsx", "data.xlsx", {
    sheetName: "Products",
  });
};

const onExportHtml = () => {
  tabulator.value.download("html", "data.html", {
    style: true,
  });
};

// Print
const onPrint = () => {
  tabulator.value.print();
};




onMounted(() => {
  //initUserList();
  initTabulator();
  reInitOnResizeWindow();
});
</script>

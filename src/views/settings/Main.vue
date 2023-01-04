<template>

  <div class="grid grid-cols-12 gap-6 mt-8">
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <Sidebar :categories="state.setCats" :activeId="state.categoryId" @activeIdChange="activeIdChange" />
    </div>
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">
      <!-- BEGIN: Inbox Filter -->

      <!-- END: Inbox Filter -->
      <!-- BEGIN: Inbox Content -->
      <div class="intro-y inbox box mt-5">
        <div class="overflow-x-auto sm:overflow-x-visible">
          <div v-for="(setting, index) in state.allSettings" class="intro-y">
            <div class="inbox__item inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400 inbox__item--active">


              <div class="grid grid-cols-6 gap-4">
                <div class="col-start-1 col-end-3  px-5 py-3">
                  <div class="inbox__item--sender truncate ml-3">
                    {{ setting.settings_name }}
                  </div>
                </div>

                <div class="col-end-7 col-span-4 px-5 py-3">
                    <SettingInput v-if="setting.settings_type == 'input_text'" :key="setting.id" :id="'ayar'+setting.id" :setting_id="setting.id" v-model="setting.settings_val" />
                    <SettingToggle v-if="setting.settings_type == 'input_toggle'" :key="setting.id" :id="'ayar'+setting.id" :setting_id="setting.id" v-model:checked="setting.settings_val" />
                    <SettingFile v-if="setting.settings_type == 'input_file'" :key="setting.id" :id="'ayar'+setting.id" :setting_id="setting.id" v-model="setting.settings_val" />
                </div>



              </div>


            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>


<script setup>
import dom from "@left4code/tw-starter/dist/js/dom";
import axios from "axios";
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";
import {useMeta} from "vue-meta";
import Sidebar from "@/components/Settings/Sidebar.vue";
import SettingInput from "@/components/Settings/Input.vue";
import SettingToggle from "@/components/Settings/Toggle.vue";
import SettingFile from "@/components/Settings/FileInput.vue";


useMeta({
  title: 'Genel Ayarlar',
  htmlAttrs: { lang: 'tr', amp: true }
});
const router = useRoute();

const state = reactive({
  loading: false,
  setCats:[],
  allSettings:[],
  categoryId:1,
});

const handleUpdate = () => {
  console.log(state.allSettings);
}

const activeIdChange = (id=1) => {
  state.categoryId = id;

  axios.get(`/admin/settings/${id}`).then((response) => {
    state.allSettings = response.data.data;
  }).catch(
    (error) => {
      console.log(error);
    }
  );
}

const getSettings = () => {
   axios.get("/admin/settings").then((response) => {
    state.setCats = response.data.data;
  }).catch(
    (error) => {
      console.log(error);
    }
  )
};

onMounted(() => {
  getSettings();
  activeIdChange();
});
</script>
<template>

  <div class="grid grid-cols-12 gap-6 mt-8">
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <LanguageSidebar :allLangs="state.allLangs" :activeId="state.langId" @activeIdChange="activeIdChange" @getLangs="getLangs" />
    </div>
    <div class="col-span-12 lg:col-span-8 2xl:col-span-9">

      <div class="intro-y inbox box mt-5">
        <div class="overflow-x-auto sm:overflow-x-visible">

          <div v-for="(constant, index) in state.allTranslations" class="intro-y">
            <div class="inbox__item inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400 inbox__item--active box">
              <div class="grid grid-cols-6 gap-4">
                <div class="col-start-1 col-end-3  px-2 py-4">
                  <div class="inbox__item--sender truncate">
                    {{ constant.key }}
                  </div>
                </div>
                <div class="col-end-7 col-span-4 px-5 py-3">
                  <LanguageInput :langKey="state.activeLang.code"  :key="constant.id" :id="'constants_'+constant.id" :constants_id="constant.id" v-model="constant.values" />
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
import {onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router";
import {useMeta} from "vue-meta";
import LanguageSidebar from "@/components/Language/Sidebar.vue";
import LanguageInput from "@/components/Language/LanguageInput.vue";


useMeta({
  title: 'Dil Ayarları',
  htmlAttrs: { lang: 'tr', amp: true }
});
const router = useRoute();

const state = reactive({
  allLangs:[],
  allTranslations:[],
  langId:1,
  activeLang:{
    code:'tr'
  }
});


const handleUpdate = () => {
  console.log(state.allTranslations);
}

const activeIdChange = (id=1) => {
  state.langId = id;

  axios.get(`/admin/languageconstant`).then((response) => {
    state.allTranslations = response.data.data;
  }).catch(
      (error) => {
        console.log(error);
      }
  );
}

const getLangInfo = () => {
  axios.get(`/admin/language/`+state.langId).then((response) => {
    state.activeLang = response.data.data;
  }).catch(
      (error) => {
        console.log(error);
      }
  );
}

const getLangs = () => {
  axios.get("/admin/language").then((response) => {
    state.allLangs = response.data.data;
  }).catch(
      (error) => {
        console.log(error);
      }
  )
};



watch(() => state.langId, () => {
  getLangInfo();
});


onMounted(() => {
  getLangs();
  activeIdChange();
  getLangInfo();
});
</script>
<template>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Yeni Kategori</h2>
  </div>
  <div class="pos intro-y grid grid-cols-12 gap-5 mt-5">
    <div class="intro-y col-span-12 lg:col-span-8" v-if="state.loaded">
      <TabGroup class="post intro-y overflow-hidden box">
        <TabList class="post__tabs nav-tabs flex-col sm:flex-row bg-slate-200 dark:bg-darkmode-800">
          <Tab v-for="(lang,index) in state.languages"  @click="setSelectedLang(lang.code)" :fullWidth="false" class="w-full sm:w-40 py-0 px-0" tag="button" :key="index">
            <Tippy
                content="Tamamlanması zorunlu içerik alanları"
                class="tooltip w-full flex items-center justify-center py-4"
                aria-controls="content"
                aria-selected="true">
              <FileTextIcon class="w-4 h-4 mr-2" />
              {{ lang.name }}
            </Tippy>
          </Tab>
        </TabList>
        <TabPanels class="post__content">

          <TabPanel v-for="(lang,index) in state.languages" :key="index " class="p-5">
            <div class="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-5">
              <div class="font-medium flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5">
                <ChevronDownIcon class="w-4 h-4 mr-2" /> {{lang.name}} bilgi alanları
              </div>
              <div class="mt-5">
                <BaseInput label="İsim" id="isim" v-model="validate.catInfo.name[lang.code].$model" :errors="validate.catInfo.name[lang.code].$errors" />
              </div>

              <div class="mt-5">
                <label for="catParent" class="form-label">Başlık</label>
                <TreeSelect
                    id="catParent"
                    :key="state.selectedCodeKey"
                    :multiple="false"
                    :options="categories"
                    :flat="true"
                    :normalizer="normalizer"
                    :searchable="true"
                    :show-count="true"
                    :default-expand-level="0"
                    noResultsText="Sonuç bulunamadı"
                    placeholder="Lütfen üst kategorisini seçiniz"
                    noChildrenText="Bu kategoriye ait alt kategori bulunamadı"
                    noOptionsText="Herhangi bir üst kategori bulunamadı"
                    v-model="catInfo.parent_id"
                />

              </div>
              <div class="mt-3">
                <BaseTextarea label="Meta Başlık" id="metaTitle" v-model="validate.catInfo.meta_title[lang.code].$model" :errors="validate.catInfo.meta_title[lang.code].$errors" />
              </div>
              <div class="mt-3">
                <BaseTextarea label="Meta Açıklama" id="metaDesc" v-model="validate.catInfo.meta_description[lang.code].$model" :errors="validate.catInfo.meta_description[lang.code].$errors" />
              </div>
            </div>

          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="intro-y box p-5">
        <label for="post-form-6" class="form-check-label ml-0 mb-2">Kategori Tipi</label>
        <select v-model="validate.catInfo.type.$model" class="form-control">
          <option value="">Seçiniz</option>
          <option value="1">Tip 1</option>
          <option value="2">Tip 2</option>
          <option value="3">Tip 3</option>
        </select>
        <div class="input-errors" v-for="(error, index) of validate.catInfo.type.$errors" :key="index">
          <small class="p-error">{{ error.$message }}</small>
        </div>
      </div>
      <div class="intro-y box p-5">
        <div class="form-check form-switch flex flex-col items-start">
          <label for="post-form-6" class="form-check-label ml-0 mb-2">Yayınlama Durumu</label>
          <input id="post-form-6" class="form-check-input" v-model="catInfo.active" type="checkbox" />
        </div>
      </div>
      <div class="intro-y box p-5">
        <div class="form-check form-switch flex flex-col items-start">
          <button class="btn btn-primary w-full" @click="handleCreate" :disabled="validate.catInfo.$invalid">Oluştur</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TreeSelect from 'vue3-acies-treeselect';
import 'vue3-acies-treeselect/dist/vue3-treeselect.css'
import {ref, reactive, onMounted, onBeforeMount} from "vue";
import axios from "axios";
import GlobalHelper from "@/helpers/global";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import { useMeta } from 'vue-meta'
import {minLength, required} from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import BaseInput from '@/components/UI/BaseInput.vue';
import BaseTextarea from '@/components/UI/BaseTextarea.vue';
const router = useRouter();
const toast = useToast();
useMeta({
  title: 'Yeni Kategori',
  htmlAttrs: { lang: 'tr', amp: true }
})
const state = reactive(
    {
      selectedCode: 'tr',
      selectedCodeKey: 0,
      languages:null,
      loaded:false,
      textRules:{},
    }
)
const catInfo = reactive(
    {
      name: {},
      meta_description:{},
      meta_title: {},
      parent_id:null,
      active:0,
      type:"",
    }
)
const setSelectedLang = (lang) => {
  state.selectedCode = lang;
  state.selectedCodeKey +=1
}
const getActiveLangs = async () => {
  axios.get('/admin/language').then((response) => {
    state.languages = response.data.data;
    state.languages.map(lang=>{
      state.textRules[lang.code] = {required}
    })
    state.loaded = true;
  });
}
const categories = ref();
const getCategories = async () => {
  axios.get('/admin/category').then((response) => {
    categories.value = response.data.data;
  });
}
const normalizer = (node) => {
  return {
    id: node.id,
    label: node.name[state.selectedCode],
    children: node.children,
  }
}
const handleCreate = () => {
  axios.post('/admin/category',catInfo).then((response) => {
    toast.success('Kategori başarıyla oluşturuldu');
    router.push('/category')
  }).catch((error) => {
    if (error.response.status == 403) {
      router.push('/extras/unauthorized')
    }else if(error.response.status == 422){
      let errs = error.response.data.errors;
      let exps = GlobalHelper.QueryExceptionErrors(errs);
      let time =0;
      exps.map(exs=>{
        toast.error(exs,{timeout:3000+time});
        time +=500;
      })
    }else{
      toast.warning('Beklenmeyen bir hata oluştu.')
    }
  });
}
const rules = {
  catInfo: {
    meta_description: state.textRules,
    meta_title: state.textRules,
    name: state.textRules,
    type: {required}
  }
}
const validate = useVuelidate(rules,{catInfo});
onBeforeMount(async () => {
  await getActiveLangs();
});
onMounted(async () => {
  await getCategories();
  setSelectedLang('tr');
})
</script>
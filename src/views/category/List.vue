<template>
  <div class="intro-y flex flex-col sm:flex-row items-center mt-8">
    <h2 class="text-lg font-medium mr-auto">Kullanıcı Listesi</h2>
    <div class="w-full sm:w-auto flex mt-4 sm:mt-0">
      <router-link to="/category/create" class="btn btn-primary shadow-md mr-2">Yeni Kategori Ekle</router-link>
    </div>
  </div>
  <div class="intro-y box p-5 mt-5">
    <BaseTree v-model="state.allCategories" :watermark="false" :indent="30" :defaultOpen="false" table class="table table-bordered table-hover w-full" :style="'width:100%'">
    <template #prepend="{ tree }">
      <thead class="w-full">
      <tr>
        <th class="whitespace-nowrap" v-if="!tree.dragOvering">#</th>
        <th class="whitespace-nowrap">İsim</th>
        <th class="whitespace-nowrap">Meta Başlık</th>
        <th class="whitespace-nowrap">Meta Açıklama</th>
        <th class="whitespace-nowrap">İşlem</th>
      </tr>
      </thead>
    </template>

    <template #default="{ node, stat, indentStyle, tree }">
      <td v-if="!tree.dragOvering">
        <button @click="stat.open = !stat.open" v-if="stat.children.length>0">
          <MinusIcon v-if="stat.open" class="w-4 h-4 mr-1" />
          <PlusIcon v-else class="w-4 h-4 mr-1" />
        </button>
      </td>
      <td :style="indentStyle">
        {{ node.name.tr }}
      </td>
      <td :style="indentStyle">
        {{ node.meta_title.tr }}
      </td>
      <td :style="indentStyle">
        {{ node.meta_description.tr }}
      </td>
      <td>
        <router-link :to="'category/'+node.id" class="btn btn-primary btn-sm">Düzenle</router-link>
      </td>
    </template>
  </BaseTree>

  </div>
</template>


<script setup>
import { BaseTree} from '@he-tree/vue'
import axios from "axios";
import {onMounted, reactive,ref} from "vue";
import {useToast} from "vue-toastification";
import {useMeta} from "vue-meta";
const toast = useToast()
useMeta({
  title: 'Kategori Listesi',
  htmlAttrs: { lang: 'tr', amp: true }
})
const state = reactive(
    {
      allCategories : null,
    }
)
const getAllCategories = () => {
  axios.get('/admin/category').then((response) => {
    state.allCategories = response.data.data;
  });
}
onMounted(() => {
  getAllCategories();
})
</script>

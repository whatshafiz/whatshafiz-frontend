<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} | ${state.site_name}` : `${state.site_name}` }}</template>
  </metainfo>
  <header />
  <router-view />
  <notifications group="auth" position="top" width="100%" />
</template>
<script setup>
import {reactive} from "vue";

const state = reactive({
  site_name: import.meta.env.VITE_SITE_NAME,
})
</script>
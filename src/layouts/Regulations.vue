<template>
    <div class="w-1/2">
        <RouterView></RouterView>
    </div>
</template>

<script setup lang="ts">
import { onBeforeRouteUpdate } from 'vue-router';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore()
onBeforeRouteUpdate(() => {
    userStore.hasPermissionsTo("regulations")
})
</script>
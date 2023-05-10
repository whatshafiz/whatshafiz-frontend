<script setup lang="ts">
import Button from "@/base-components/Button"
import Lucide from "@/base-components/Lucide"

</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Anasayfa</h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="p-5 mt-5 mb-4 intro-y box">Hoşgeldiniz!</div>

  <div class="flex flex-wrap">
    <RouterLink :to="{ name: 'my.whatsappGroups' }" class="w-full">
      <Button variant="primary" size="lg" class="w-full my-4 text-white h-20 text-xl">
        <Lucide icon="Users" class="w-4 h-4 mr-2" /> Whatsapp Gruplarım
      </Button>
    </RouterLink>
    <RouterLink :to="{ name: 'my.courses' }" class="w-full">
      <Button variant="primary" size="lg" class="w-full my-4 text-white h-20 text-xl">
        <Lucide icon="CalendarDays" class="w-4 h-4 mr-2" /> Kurslarım
      </Button>
    </RouterLink>
  </div>

</template>

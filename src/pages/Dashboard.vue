<script setup lang="ts">
import ProficiencyExamIndex from '@/pages/teacherStudents/ProficiencyExamIndex.vue'
import WhatsappGroupsIndex from '@/pages/whatsappGroups/Index.vue'
import CoursesIndex from '@/pages/courses/Index.vue'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Anasayfa</h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="p-5 mt-5 mb-4 intro-y box">{{ user.profile.name }} {{ user.profile.surname }}, Hoşgeldiniz!</div>

  <proficiency-exam-index />
  <whatsapp-groups-index :my-index="true" />
  <courses-index :my-index="true" />
</template>

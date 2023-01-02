<template>
  <div class="border-t border-white/10 dark:border-darkmode-400 mt-6 pt-6 text-white intro-x">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-8 lg:col-span-9 2xl:col-span-9">
        <div class="flex items-center block w-full py-2 rounded-md" >
          <AnimatedPlaceholder
              height="1rem"
              width="1rem"
              borderRadius="0"
              class="absolute ml-2"
          />
          <AnimatedPlaceholder height="30px" width="100%" />
        </div>
      </div>
      <div class="col-span-3 lg:col-span-3 2xl:col-span-3 py-2 ">
        <AnimatedPlaceholder height="30px" width="33%"  />
      </div>
    </div>
  </div>
</template>

<script setup>
import AnimatedPlaceholder from "./AnimatedLangButtons.vue";
</script>

<style scoped>
.summary-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
</style>
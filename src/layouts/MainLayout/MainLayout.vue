<script setup lang="ts">

import MobileMenu from "../../components/MobileMenu";

</script>

<template>
<div>
  <div class="py-5 md:py-0">
    <MobileMenu />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block">
        <ul>
          <!-- BEGIN: First Child -->

          <!-- END: First Child -->
        </ul>
      </nav>

        <RouterView />
      </div>
      <!-- END: Content -->
  </div>

</div>
</template>

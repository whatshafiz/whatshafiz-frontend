<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "@/base-components/Button";
import { useWhatsappMessengerStore } from "@/stores/whatsappMessenger";
import Tippy from "@/base-components/Tippy";
import Lucide from "@/base-components/Lucide";
import LoadingIcon from '@/base-components/LoadingIcon'
import TinySlider from "@/base-components/TinySlider";
import { Dialog } from "@/base-components/Headless";

const isLoading = ref(false)
const whatsappmessengerStore = useWhatsappMessengerStore()
const whatsappMessengerNumbers = ref([])
const tinySliderModalPreview = ref(false);
const tinySliderImages = ref([])

const refreshPage = async () => {
  isLoading.value = true
  whatsappMessengerNumbers.value = []
  whatsappMessengerNumbers.value = await whatsappmessengerStore.fetchNumbers()
  isLoading.value = false
}

const setTinySliderModalPreview = (value, screenshots = []) => {
  tinySliderImages.value = screenshots
  tinySliderModalPreview.value = value
}

onMounted(async () => {
  refreshPage()
})
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Whatsapp Messenger Numaraları</h2>
    <Button @click="refreshPage()" variant="primary" class="mr-2 shadow-md" :disabled="isLoading">
      Sayfayı Yenile <Lucide v-show="!isLoading" icon="RotateCw" class="ml-1" />
      <LoadingIcon v-show="isLoading" icon="oval" color="white" class="ml-1" />
    </Button>
  </div>
  <div v-if="!isLoading" class="grid grid-cols-12 gap-6 mt-5">
    <div v-for="(whatsappMessengerNumber, key) in whatsappMessengerNumbers" :key="key"
      class="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-3">
      <div class="box">
        <div class="p-5">
          <div class="overflow-hidden rounded-md">
            <img alt="Midone - HTML Admin Template" class="rounded-md w-full" :src="whatsappMessengerNumber.qrcode_url" />
          </div>
          <div class="mt-5 text-slate-600 dark:text-slate-500">
            <div class="flex items-center">
              <Lucide icon="Phone" class="w-4 h-4 mr-2" />
              Tel No: <strong class="ml-1">{{ whatsappMessengerNumber.phone_number }}</strong>
            </div>
            <div class="flex items-center mt-2">
              <Lucide icon="Layers" class="w-4 h-4 mr-2" />
              Instance ID: <strong class="ml-1">{{ whatsappMessengerNumber.instance_id }}</strong>
            </div>
            <div class="flex items-center mt-2">
              <Lucide icon="Calendar" class="w-4 h-4 mr-2" />
              Son Aktivite: <strong class="ml-1">{{ whatsappMessengerNumber.last_activity_at }}</strong>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <span class="block text-base font-medium">
            Ekran Görüntüleri
          </span>
          <div class="flex mt-2 intro-x">
            <div
              v-for="(screenshotUrl, urlKey) in whatsappMessengerNumber.screenshots" :key="urlKey"
              class="w-8 h-8 intro-x image-fit -ml-3"
              @click="setTinySliderModalPreview(true, whatsappMessengerNumber.screenshots)"
            >
              <Tippy as="img" alt="Midone Tailwind HTML Admin Template" class="border border-white rounded-full zoom-in"
                :src="screenshotUrl"
                :content="(screenshotUrl.split('?')[0]).split('/')[6].split('.')[0]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    v-if="tinySliderImages.length > 0"
    :open="tinySliderModalPreview" @close="() => setTinySliderModalPreview(false)"
    size="xl"
  >
      <Dialog.Panel class="p-5">
          <div class="mx-6">
              <TinySlider :options="{
                mouseDrag: true,
                autoplay: false,
                controls: true,
                center: true,
                items: 1,
                nav: false,
                speed: 500,
                responsive: {
                  900: {
                    items: 1,
                  },
                },
              }">
                  <div v-for="(image, imageKey) in tinySliderImages" :key="imageKey" class="h-full w-full p-2">
                      <div class="h-full overflow-hidden rounded-md text-center">
                          <img alt="ekran görüntüleri" :src="image" />
                          <span class="block text-base font-medium mt-4">
                            {{ (image.split('?')[0]).split('/')[6].split('.')[0] }}
                          </span>
                      </div>
                  </div>
              </TinySlider>
          </div>
      </Dialog.Panel>
  </Dialog>
</template>

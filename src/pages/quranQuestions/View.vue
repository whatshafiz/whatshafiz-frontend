<script setup lang="ts">
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import { ref, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useQuranQuestionStore } from "@/stores/quranQuestion"
import _ from "lodash";

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const quranQuestionId = route.params.quranQuestionId
const quranQuestionStore = useQuranQuestionStore()
const quranQuestion = ref({})

onBeforeMount(async () => {
  quranQuestion.value = await quranQuestionStore.fetchQuranQuestion(quranQuestionId)
})
</script>

<template>
  <div v-if="user.can('universities.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Meal Sorusu Detayları</h2>
    </div>
    <div class="grid grid-cols-10 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Meal Sorusu</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form mt-4">
                <FormLabel htmlFor="page_number" class="flex flex-col w-full sm:flex-row">
                  Soru Sayfası
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="page_number"
                  v-model="quranQuestion.page_number"
                  :value="quranQuestion.page_number"
                  type="number"
                  name="page_number"
                  disabled
                  placeholder="Hangi sayfanın sorusu olduğunu yazın, Örn: 143"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="question" class="flex flex-col w-full sm:flex-row">
                  Soru
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormTextarea
                  id="question"
                  v-model="quranQuestion.question"
                  :value="quranQuestion.question"
                  type="text"
                  name="question"
                  disabled
                  placeholder="Soruyu Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="option_1" class="flex flex-col w-full sm:flex-row">
                  1. Şık
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="option_1"
                  v-model="quranQuestion.option_1"
                  :value="quranQuestion.option_1"
                  type="text"
                  :class="quranQuestion.correct_option === 1 ? 'border-success disabled:bg-green-200' : ''"
                  name="option_1"
                  disabled
                  placeholder="1. Şıkkı Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="option_2" class="flex flex-col w-full sm:flex-row">
                  2. Şık
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="option_2"
                  v-model="quranQuestion.option_2"
                  :value="quranQuestion.option_2"
                  type="text"
                  :class="quranQuestion.correct_option === 2 ? 'border-success disabled:bg-green-200' : ''"
                  name="option_2"
                  disabled
                  placeholder="2. Şıkkı Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="option_3" class="flex flex-col w-full sm:flex-row">
                  3. Şık
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="option_3"
                  v-model="quranQuestion.option_3"
                  :value="quranQuestion.option_3"
                  type="text"
                  :class="quranQuestion.correct_option === 3 ? 'border-success disabled:bg-green-200' : ''"
                  name="option_3"
                  disabled
                  placeholder="3. Şıkkı Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="option_4" class="flex flex-col w-full sm:flex-row">
                  4. Şık
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="option_4"
                  v-model="quranQuestion.option_4"
                  :value="quranQuestion.option_4"
                  type="text"
                  :class="quranQuestion.correct_option === 4 ? 'border-success disabled:bg-green-200' : ''"
                  name="option_4"
                  disabled
                  placeholder="4. Şıkkı Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="option_5" class="flex flex-col w-full sm:flex-row">
                  5. Şık
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="option_5"
                  v-model="quranQuestion.option_5"
                  :value="quranQuestion.option_5"
                  type="text"
                  :class="quranQuestion.correct_option === 5 ? 'border-success disabled:bg-green-200' : ''"
                  name="option_5"
                  disabled
                  placeholder="5. Şıkkı Yazın"
                />
              </div>
              <Button variant="outline-secondary" type="button" class="mt-5 mr-5" @click="() => router.go(-1)">
                Geri
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

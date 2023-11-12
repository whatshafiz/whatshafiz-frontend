<script setup lang="ts">
import Button from '@/base-components/Button'
import Lucide from '@/base-components/Lucide'
import LoadingIcon from '@/base-components/LoadingIcon'
import { Dialog } from '@/base-components/Headless'
import { FormLabel, FormInput, FormSelect } from '@/base-components/Form'
import { useUserStore } from '@/stores/user'
import useClipboard from 'vue-clipboard3'
import { ref, inject, onBeforeMount, computed } from 'vue'
import userProfile from '@/assets/images/placeholders/user.png'
import maleProfile from '@/assets/images/placeholders/male.jpg'
import femaleProfile from '@/assets/images/placeholders/female.jpg'

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const isLoading = ref(false)
const user = useUserStore()
const { toClipboard } = useClipboard()
const course = ref({})
const teachers = ref({})
const students = ref({})
const studentToEdit = ref({})
const showStudentStatusModal = ref(false)

onBeforeMount(async () => {
  if (user.hasRole('HafızOl')) {
    teachers.value = await user.fetchTeachers()
  }

  if (user.hasRole('HafızKal')) {
    students.value = await user.fetchStudents()
  }
})

const copyPhoneNumber = (phoneNumber) => {
  toClipboard(phoneNumber)
  successNotificationToggle('Telefon No kopyalandı.', phoneNumber)
}

const hideStudentModal = () => {
  showStudentStatusModal.value = false
  studentToEdit.value = null
}

const editStudent = async (student) => {
  isLoading.value = false
  showStudentStatusModal.value = true
  studentToEdit.value = student
}

const saveStudentStatus = async () => {
  isLoading.value = true

  if (studentToEdit.value.proficiency_exam_passed === false && !studentToEdit.value.proficiency_exam_failed_description) {
    errorNotificationToggle('İşlem Başarısız', 'Red sebebini yazmalısınız!')
    isLoading.value = false

    return
  }

  if (await user.updateStudentStatus(studentToEdit.value.id, studentToEdit.value)) {
    studentToEdit.value = null
    successNotificationToggle('İşlem Başarılı', 'Öğrenci Durum Bilgileri Güncellendi.')
  }
  
  showStudentStatusModal.value = false
}
</script>

<template>
  <div v-if="user && user.hasRole('HafızOl') && teachers.length > 0" class="p-5 mt-5 mb-4 intro-y">
    <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
      <div class="flex items-center h-10 intro-x">
        <h2 class="mr-5 text-lg font-medium truncate">HafızKal Hoca Bilgileri</h2>
      </div>
      <div class="mt-5">
        <div v-for="teacher in teachers" class="intro-x">
          <div class="flex items-center px-5 py-3 mb-3 box justify-between flex-col md:flex-row">
            <div class="flex w-auto">
              <div class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                <img :alt="teacher.teacher.name" :src="teacher.teacher.gender === 'male' ?
                  maleProfile :
                  (teacher.teacher.gender === 'female' ? femaleProfile : userProfile)
                  " />
              </div>
              <div class="ml-4 mr-auto">
                <div class="font-medium">{{ teacher.teacher.name }} {{ teacher.teacher.surname }}</div>
                <div class="text-slate-500 text-xs mt-0.5"> {{ teacher.course.name }} </div>
              </div>
            </div>
            <div class="flex mt-10 md:mt-0 w-max">
              <span class="flex mr-3 items-center">
                Telefon No:
              </span>
              <a class="flex mr-3 items-center cursor-pointer" @click="copyPhoneNumber(teacher.teacher.phone_number)">
                <Lucide icon="Copy" class="w-4 h-4 mr-1" /> Kopyala
              </a>
              <a class="flex mr-3 items-center text-success" target="_blank"
                :href="'https://wa.me/' + teacher.teacher.phone_number">
                <Lucide icon="MessageSquare" class="w-4 h-4 mr-1" /> Mesaj Gönder
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="user && user.hasRole('HafızKal') && students.length > 0" class="p-5 mt-5 mb-4 intro-y">
    <div class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
      <div class="flex items-center h-10 intro-x">
        <h2 class="mr-5 text-lg font-medium truncate">HafızOl Öğrenci Adaylarınız</h2>
      </div>
      <div class="mt-5">
        <div v-for="student in students" class="intro-x">
          <div class="flex items-center px-5 py-3 mb-3 box justify-between flex-col md:flex-row">
            <div class="flex w-auto">
              <div class="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                <img :alt="student.student.name" :src="student.student.gender === 'male' ?
                  maleProfile :
                  (student.student.gender === 'female' ? femaleProfile : userProfile)
                  " />
              </div>
              <div class="ml-4 mr-auto">
                <div class="font-medium">{{ student.student.name }} {{ student.student.surname }}</div>
                <div class="text-slate-500 text-xs mt-0.5"> {{ student.course.name }} </div>
              </div>
            </div>
            <div class="flex mt-10 md:mt-0 w-max">
              <span class="flex mr-3 items-center">
                Durumu:
              </span>
              <span v-if="student.proficiency_exam_passed === null" class="flex mr-3 items-center text-warning">
                <Lucide icon="Timer" class="w-4 h-4 mr-1" /> Beklemede
              </span>
              <span v-if="student.proficiency_exam_passed === false" class="flex mr-3 items-center text-danger">
                <Lucide icon="XCircle" class="w-4 h-4 mr-1" /> Red
              </span>
              <span v-if="student.proficiency_exam_passed === true" class="flex mr-3 items-center text-success"
                target="_blank">
                <Lucide icon="CheckCircle" class="w-4 h-4 mr-1" /> Kabul
              </span>
              <a class="flex mr-3 items-center cursor-pointer hover:text-blue-600 text-gray-500"
                @click="editStudent(student)">
                <Lucide icon="Edit" class="w-4 h-4 mr-1" />
              </a>
            </div>
            <div class="flex mt-10 md:mt-0 w-max">
              <span class="flex mr-3 items-center">
                Telefon No:
              </span>
              <a class="flex mr-3 items-center cursor-pointer" @click="copyPhoneNumber(student.student.phone_number)">
                <Lucide icon="Copy" class="w-4 h-4 mr-1" /> Kopyala
              </a>
              <a class="flex mr-3 items-center text-success" target="_blank"
                :href="'https://wa.me/' + student.student.phone_number">
                <Lucide icon="MessageSquare" class="w-4 h-4 mr-1" /> Mesaj Gönder
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog :open="showStudentStatusModal" @close="() => hideStudentModal()">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          Öğrenci Durumunu Güncelle
        </h2>
      </Dialog.Title>
      <Dialog.Description class="grid grid-cols-12 gap-4 gap-y-3">
        <template v-if="studentToEdit">
          <div class="col-span-12 sm:col-span-6">
            <FormLabel class="text-xl">
                Öğrenci: {{ studentToEdit.student.name }} {{ studentToEdit.student.surname }}
            </FormLabel>
          </div>
          <div class="col-span-12">
            <FormLabel htmlFor="student-status"> Durumu </FormLabel>
            <FormSelect v-model="studentToEdit.proficiency_exam_passed" id="student-status">
              <option disabled>Durum Seçin</option>
              <option :value="null">Beklemede</option>
              <option :value="false">Red</option>
              <option :value="true">Kabul</option>
            </FormSelect>
          </div>
          <div v-if="studentToEdit.proficiency_exam_passed === false" class="col-span-12">
            <FormLabel htmlFor="student-status-text">
              Red Sebebini Belirtin
            </FormLabel>
            <FormInput
              v-model="studentToEdit.proficiency_exam_failed_description"
              id="student-status-text"
              type="text"
              placeholder="Öğrenci red sebebini buraya yazın."
            />
          </div>
        </template>
      </Dialog.Description>
      <Dialog.Footer>
        <Button type="button" variant="outline-secondary" @click="() => {
          isLoading = false
          hideStudentModal();
        }
          " class="w-20 mr-1">
          İptal
        </Button>
        <Button
          variant="primary"
          type="button"
          class="w-20"
          @click="saveStudentStatus()"
          :disabled="isLoading"
        >
          <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-1" />
          Kaydet
        </Button>
      </Dialog.Footer>
    </Dialog.Panel>
  </Dialog>
</template>

<script setup lang="ts">
import Lucide from '@/base-components/Lucide'
import Table from '@/base-components/Table'
import Button from '@/base-components/Button'
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import { FormSelect } from '@/base-components/Form'
import Profile from '@/pages/users/Profile.vue'
import { ref, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import { useWhatsappGroupStore } from "@/stores/whatsappGroup"
import { useRoleStore } from "@/stores/role"
import { useAlertStore } from "@/stores/alert"
import _ from "lodash"

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')
const isLoading = ref(false)
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const userId = route.params.userId
const userStore = useUserStore()
const courseStore = useCourseStore()
const whatsappGroupStore = useWhatsappGroupStore()
const roleStore = useRoleStore()
const user = ref({})
const courses = ref([])
const whatsappGroups = ref([])
const roles = ref([])
const assignNewRoleFormVisible = ref(false)
const attachNewCourseFormVisible = ref(false)
const attachNewWhatsappGroupFormVisible = ref(false)
const newRoleId = ref(0)
const newCourseId = ref(0)
const newWhatsappGroupId = ref(0)

const reportUser = () => {
  router.push({ name: 'complaints.create', query: { userId: userId } })
}

const toggleUserBanStatus = async () => {
  if (await userStore.toggleUserBanStatus(user.value.id, !user.value.is_banned)) {
    successNotificationToggle('İşlem Başarılı', (user.value.is_banned ? 'Kullanıcı banı kaldırıldı!' : 'Kullanıcı Banlandı!'))
    router.push({ name: 'users.view', params: { userId: user.value.id } })
    user.value.id = null
    user.value = await userStore.fetchUser(userId)
  } else {
    errorNotificationToggle('HATA', 'İşlem sırasında hata oluştu!')
  }
}
const assignNewRole = async () => {
  isLoading.value = true

  if (roles.value.length === 0) {
    roles.value = await roleStore.fetchRoles()
  }

  roles.value = roles.value.filter(role => !user.value.roles.find(r => r.id === role.id))

  assignNewRoleFormVisible.value = true
  isLoading.value = false
}

const saveNewRole = async () => {
  isLoading.value = true
  await userStore.assignRole(userId, newRoleId.value)
  user.value.roles = []
  user.value.roles = (await userStore.fetchUser(userId)).roles
  assignNewRoleFormVisible.value = false
  isLoading.value = false
  newRoleId.value = 0
}

const removeRoleFromUserWithModal = (roleId) => {
  alertStore.setDeleteModalPreview(true)
  alertStore.setDeleteModalAction(() => removeRoleFromUser(roleId))
}

const removeRoleFromUser = async (roleId) => {
  if (await userStore.removeRole(userId, roleId)) {
    successNotificationToggle('İşlem Başarılı', 'Rol Kullanıcıdan Kaldırıldı!')
    user.value.roles = []
    user.value.roles = (await userStore.fetchUser(userId)).roles
    assignNewRoleFormVisible.value = false
  } else {
    errorNotificationToggle('HATA', 'Rol kaldırılamadı!')
  }
}

const attachNewCourse = async () => {
  isLoading.value = true

  if (courses.value.length === 0) {
    courses.value = await courseStore.fetchCourses()
  }

  courses.value = courses.value.filter(course => !user.value.courses.find(c => c.id === course.id))

  attachNewCourseFormVisible.value = true
  isLoading.value = false
}

const saveNewCourse = async () => {
  isLoading.value = true
  await userStore.attachCourse(userId, newCourseId.value)
  user.value.courses = []
  user.value.courses = (await userStore.fetchUser(userId)).courses
  attachNewCourseFormVisible.value = false
  isLoading.value = false
  newCourseId.value = 0
}

const removeCourseFromUserWithModal = (courseId) => {
  alertStore.setDeleteModalPreview(true)
  alertStore.setDeleteModalAction(() => removeCourseFromUser(courseId))
}

const removeCourseFromUser = async (courseId) => {
  if (await userStore.removeCourse(userId, courseId)) {
    successNotificationToggle('İşlem Başarılı', 'Kurs Kullanıcıdan Kaldırıldı!')
    user.value.courses = []
    user.value.courses = (await userStore.fetchUser(userId)).courses
  } else {
    errorNotificationToggle('HATA', 'Kurs kaldırılamadı!')
  }
}

const attachNewWhatsappGroup = async () => {
  isLoading.value = true

  if (whatsappGroups.value.length === 0) {
    whatsappGroups.value = await whatsappGroupStore.fetchWhatsappGroups({ size: 5000, gender: user.value.gender })
  }

  whatsappGroups.value = whatsappGroups.value.filter(whatsappGroup => !user.value.whatsapp_groups.find(c => c.id === whatsappGroup.id))

  attachNewWhatsappGroupFormVisible.value = true
  isLoading.value = false
}

const saveNewWhatsappGroup = async () => {
  isLoading.value = true
  await userStore.attachWhatsappGroup(userId, newWhatsappGroupId.value)
  user.value.whatsapp_groups = []
  user.value.whatsapp_groups = (await userStore.fetchUser(userId)).whatsapp_groups
  attachNewWhatsappGroupFormVisible.value = false
  isLoading.value = false
  newWhatsappGroupId.value = 0
}

const removeWhatsappGroupFromUserWithModal = (whatsappGroupId) => {
  alertStore.setDeleteModalPreview(true)
  alertStore.setDeleteModalAction(() => removeWhatsappGroupFromUser(whatsappGroupId))
}

const removeWhatsappGroupFromUser = async (whatsappGroupId) => {
  if (await userStore.removeWhatsappGroup(userId, whatsappGroupId)) {
    successNotificationToggle('İşlem Başarılı', 'Whatsapp Grubu Kullanıcıdan Kaldırıldı!')
    user.value.whatsapp_groups = []
    user.value.whatsapp_groups = (await userStore.fetchUser(userId)).whatsapp_groups
    attachNewWhatsappGroupFormVisible.value = false
  } else {
    errorNotificationToggle('HATA', 'Whatsapp Grubu kaldırılamadı!')
  }
}

onBeforeMount(async () => {
  user.value = await userStore.fetchUser(userId)
})
</script>

<template>
  <div v-if="userStore.can('users.view')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Kullanıcı Detayları</h2>
      <div
        v-if="userStore.can('users.delete')"
        class="flex w-full mt-4 sm:w-auto sm:mt-0"
      >
        <Button
          v-if="user.is_banned"
          variant="soft-warning"
          class="mr-2 shadow-md"
          @click="() => toggleUserBanStatus()"
        >
          Kullanıcı Banını Kaldır
        </Button>
        <Button
          v-else
          variant="soft-danger"
          class="mr-2 shadow-md"
          @click="() => toggleUserBanStatus()"
        >
          Kullanıcıyı Banla
        </Button>
      </div>
      <div
        v-if="!user.is_banned"
        class="flex w-full mt-4 sm:w-auto sm:mt-0"
      >
        <Button
          variant="soft-danger"
          class="mr-2 shadow-md"
          @click="() => reportUser()"
        >
          Şikayet Et
        </Button>
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-6 mt-5">
      <profile
        v-if="user.id"
        :user="user"
      />
      <div class="grid grid-cols-1 mt-5">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Roller</h2>
            <div
              v-if="userStore.hasRole('Admin')"
              class="flex w-full mt-4 sm:w-auto sm:mt-0"
            >
              <Button
                variant="primary"
                class="mr-2 shadow-md"
                @click.native="assignNewRole()"
              >
                <LoadingIcon
                  v-show="isLoading"
                  icon="oval"
                  color="white"
                  class="w-4 h-4 mr-5"
                />
                Yeni Rol Ekle
              </Button>
            </div>
          </div>
          <div class="p-2">
            <div
              v-if="assignNewRoleFormVisible"
              class="pb-4 border-b border-slate-200/60 dark:border-darkmode-400"
            >
              <div class="flex flex-col-reverse items-center sm:flex-row-reverse">
                <TomSelect
                  v-model="newRoleId"
                  :options="{
                    placeholder: 'Rol Seçin',
                  }"
                  class="w-full sm:mt-2 sm:mx-2"
                >
                  <option
                    v-for="role in roles"
                    :value="role.id"
                  >{{ role.name }}</option>
                </TomSelect>
                <Button
                  variant="primary"
                  class="mr-2 mt-2 shadow-md"
                  @click.native="saveNewRole()"
                >
                  <LoadingIcon
                    v-show="isLoading"
                    icon="oval"
                    color="white"
                    class="w-4 h-4 mr-5"
                  />
                  Kaydet
                </Button>
              </div>
            </div>
            <div
              v-if="user.roles?.length > 0"
              class="col-span-12 overflow-auto intro-y lg:overflow-visible"
            >
              <Table class="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> Kurs Adı </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> İşlemler </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr
                    v-for="(role, key) in user.roles"
                    :key="key"
                    class="intro-x"
                  >
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ role.id }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ role.name }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-20 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
                    >
                      <div class="flex items-center justify-center">
                        <span
                          class="flex items-center text-danger cursor-pointer"
                          @click="() => removeRoleFromUserWithModal(role.id)"
                        >
                          <Lucide
                            icon="Trash2"
                            class="w-4 h-4 mr-1"
                          /> Kaldır
                        </span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div
              v-else
              class="text-center p-5"
            >
              Henüz Rol Atanmamış
            </div>
          </div>
        </div>
        <div class="intro-y box mt-5">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Kurslar</h2>
            <div
              v-if="userStore.hasRole('Admin')"
              class="flex w-full mt-4 sm:w-auto sm:mt-0"
            >
              <Button
                variant="primary"
                class="mr-2 shadow-md"
                @click.native="attachNewCourse()"
              >
                <LoadingIcon
                  v-show="isLoading"
                  icon="oval"
                  color="white"
                  class="w-4 h-4 mr-5"
                />
                Yeni Kurs Ekle
              </Button>
            </div>
          </div>
          <div class="p-2">
            <div
              v-if="attachNewCourseFormVisible"
              class="pb-4 border-b border-slate-200/60 dark:border-darkmode-400"
            >
              <div class="flex flex-col-reverse items-center sm:flex-row-reverse">
                <TomSelect
                  v-model="newCourseId"
                  :options="{
                    placeholder: 'Kurs Seçin',
                  }"
                  class="w-full sm:mt-2 sm:mx-2"
                >
                  <option
                    v-for="course in courses"
                    :value="course.id"
                  >{{ course.name }}</option>
                </TomSelect>
                <Button
                  variant="primary"
                  class="mr-2 mt-2 shadow-md"
                  @click.native="saveNewCourse()"
                >
                  <LoadingIcon
                    v-show="isLoading"
                    icon="oval"
                    color="white"
                    class="w-4 h-4 mr-5"
                  />
                  Kaydet
                </Button>
              </div>
            </div>
            <div
              v-if="user.courses?.length > 0"
              class="col-span-12 overflow-auto intro-y lg:overflow-visible"
            >
              <Table class="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> Kurs Adı </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> İşlemler </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr
                    v-for="(course, key) in user.courses"
                    :key="key"
                    class="intro-x"
                  >
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ course.id }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ course.name }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
                    >
                      <div class="flex items-center justify-center">
                        <span
                          v-if="userStore.can('courses.view')"
                          class="flex items-center mr-3 w-20 cursor-pointer"
                          @click="() => router.push({ name: 'courses.view', params: { courseId: course.id } })"
                        >
                          <Lucide
                            icon="Eye"
                            class="w-4 h-4 mr-1"
                          /> Görüntüle
                        </span>
                        <span
                          v-if="userStore.can('users.update')"
                          @click="() => removeCourseFromUserWithModal(course.id)"
                          class="flex items-center text-danger cursor-pointer"
                        >
                          <Lucide
                            icon="Trash2"
                            class="w-4 h-4 mr-1"
                          /> Kaldır
                        </span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div
              v-else
              class="text-center p-5"
            >
              Henüz Kursa Katılmamış
            </div>
          </div>
        </div>
        <div class="intro-y box mt-5">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Whatsapp Grupları</h2>
            <div
              v-if="userStore.hasRole('Admin')"
              class="flex w-full mt-4 sm:w-auto sm:mt-0"
            >
              <Button
                variant="primary"
                class="mr-2 shadow-md"
                @click.native="attachNewWhatsappGroup()"
              >
                <LoadingIcon
                  v-show="isLoading"
                  icon="oval"
                  color="white"
                  class="w-4 h-4 mr-5"
                />
                Yeni Grup Ekle
              </Button>
            </div>
          </div>
          <div class="p-2">
            <div
              v-if="attachNewWhatsappGroupFormVisible"
              class="pb-4 border-b border-slate-200/60 dark:border-darkmode-400"
            >
              <div class="flex flex-col-reverse items-center sm:flex-row-reverse">
                <TomSelect
                  v-model="newWhatsappGroupId"
                  :options="{
                    placeholder: 'Whatsapp Grubu Seçin',
                  }"
                  class="w-full sm:mt-2 sm:mx-2"
                >
                  <option
                    v-for="whatsappGroup in whatsappGroups"
                    :value="whatsappGroup.id"
                  >{{ whatsappGroup.name }}</option>
                </TomSelect>
                <Button
                  variant="primary"
                  class="mr-2 mt-2 shadow-md"
                  @click.native="saveNewWhatsappGroup()"
                >
                  <LoadingIcon
                    v-show="isLoading"
                    icon="oval"
                    color="white"
                    class="w-4 h-4 mr-5"
                  />
                  Kaydet
                </Button>
              </div>
            </div>
            <div
              v-if="user.whatsapp_groups?.length > 0"
              class="col-span-12 overflow-auto intro-y lg:overflow-visible"
            >
              <Table class="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> Whatsapp Grup Adı </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> İşlemler </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr
                    v-for="(whatsappGroup, key) in user.whatsapp_groups"
                    :key="key"
                    class="intro-x"
                  >
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ whatsappGroup.id }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ whatsappGroup.name }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
                    >
                      <div class="flex items-center justify-center">
                        <span
                          v-if="userStore.can('whatsappGroups.view')"
                          class="flex items-center mr-3 w-20 cursor-pointer"
                          @click="() => router.push({ name: 'whatsappGroups.view', params: { whatsappGroupId: whatsappGroup.id } })"
                        >
                          <Lucide
                            icon="Eye"
                            class="w-4 h-4 mr-1"
                          /> Görüntüle
                        </span>
                        <span
                          v-if="userStore.can('users.update')"
                          @click="() => removeWhatsappGroupFromUserWithModal(whatsappGroup.id)"
                          class="flex items-center text-danger cursor-pointer"
                        >
                          <Lucide
                            icon="Trash2"
                            class="w-4 h-4 mr-1"
                          /> Kaldır
                        </span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div
              v-else
              class="text-center p-5"
            >
              Henüz Whatsapp Grubuna Katılmamış
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

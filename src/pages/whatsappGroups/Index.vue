<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, inject, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import useClipboard from 'vue-clipboard3'
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useWhatsappGroupStore } from "@/stores/whatsappGroup";
import { useAlertStore } from "@/stores/alert";
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref();
const { toClipboard } = useClipboard()
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const whatsappGroupStore = useWhatsappGroupStore()
const whatsappGroupIndexUrl = ref('')
const isMyIndex = ref(false)

const props = defineProps<{
  courseId?: number
  courseName?: string
  myIndex?: Boolean
}>()

onBeforeMount(() => {
  setIndexUrl()
})

watch(() => route.meta, (newValue) => {
  setIndexUrl()
  setTimeout(() => {
    if (tableRef.value) {
      tableRef.value.initTabulator()
    }
  }, 100);
})

const setIndexUrl = () => {
  if (props.courseId) {
    whatsappGroupIndexUrl.value = whatsappGroupStore.getCourseWhatsappGroupsIndexURL(props.courseId)

    return
  }

  isMyIndex.value = !!route.meta?.isMyIndex || props.myIndex

  whatsappGroupIndexUrl.value = isMyIndex.value ? whatsappGroupStore.getMyIndexURL : whatsappGroupStore.getIndexURL
}

const deleteWhatsappGroup = async (whatsappGroupId) => {
  if (await whatsappGroupStore.deleteWhatsappGroup(whatsappGroupId)) {
    successNotificationToggle('İşlem Başarılı', 'Whatsapp Grubu Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Whatsapp Grubu Silinemedi!')
  }
}

const tableColumns = [
  {
    title: "",
    formatter: "responsiveCollapse",
    width: 40,
    minWidth: 30,
    hozAlign: "center",
    resizable: false,
    headerSort: false,
  },

  // For HTML table
  {
    title: "ID",
    width: 70,
    responsive: 0,
    field: "id",
    vertAlign: "middle",
  },
  {
    title: "Grup Adı",
    responsive: 1,
    minWidth: 150,
    field: "name",
    vertAlign: "middle",
  },
  {
    title: "Eğitim Türü",
    responsive: 2,
    width: 130,
    field: "type",
    vertAlign: "middle",
  },
  {
    title: "Cinsiyet",
    responsive: 3,
    width: 110,
    field: "gender",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      const genderImage = rowData.gender === 'male' ? maleProfile :
        (rowData.gender === 'female' ? femaleProfile : userProfile)

      return `<img alt="WhatsHafız Panel Kullanıcısı" class="rounded-full w-8" src="${genderImage}" />`;
    },
  },
  {
    title: "Kurs Adı",
    responsive: 4,
    width: 150,
    field: "course.name",
    vertAlign: "middle",
    headerSort: false,
  },
  {
    title: "Kullanıcılar",
    responsive: 6,
    width: 130,
    field: "users_count",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const usersButton = stringToHTML(
        `<a class="flex items-center mr-3 text-primary hover:underline" href="javascript:;">
          <i data-lucide="users" class="w-4 h-4 mr-1"></i>
          ${rowData.users_count} Kişi
        </a>`
      );
      usersButton.addEventListener("click", function () {
        router.push({ name: 'users.index', query: { whatsappGroupId: rowData.id } })
      });

      buttonsHolder.append(usersButton)

      return buttonsHolder
    },
  },
  {
    title: "Durum",
    responsive: 5,
    width: 100,
    field: "is_active",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      return `<div class="flex items-center lg:justify-center ${rowData.is_active ? "text-success" : "text-danger"}">
          </i> ${rowData.is_active ? "Aktif" : "Pasif"}
        </div>`;
    },
  },
  {
    title: "Grup Linki",
    responsive: 8,
    width: 170,
    field: "join_url",
    vertAlign: "middle",
    headerHozAlign: "center",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const copyButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                          <i data-lucide="copy" class="w-4 h-4 mr-1"></i> Kopyala
                      </a>`);
      const joinButton =
        stringToHTML(`<a class="flex items-center mr-3 text-success" target="_blank" href="${rowData.join_url}">
                          <i data-lucide="external-link" class="w-4 h-4 mr-1"></i> Katıl
                      </a>`);

      copyButton.addEventListener("click", function (button) {
        toClipboard(rowData.join_url)
        successNotificationToggle('Grup linki kopyalandı.', rowData.join_url)
      });

      buttonsHolder.append(copyButton)
      buttonsHolder.append(joinButton)

      return buttonsHolder
    },
  },
  {
    title: "İŞLEMLER",
    width: 230,
    field: "actions",
    responsive: 10,
    hozAlign: "center",
    headerHozAlign: "center",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const showButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                                <i data-lucide="eye" class="w-4 h-4 mr-1"></i> Görüntüle
                            </a>`);
      const editButton =
        stringToHTML(`<a class="flex items-center mr-3 text-primary" href="javascript:;">
                                <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Düzenle
                            </a>`);
      const deleteButton =
        stringToHTML(`<a class="flex items-center text-danger" href="javascript:;">
                            <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Sil
                            </a>`);

      showButton.addEventListener("click", function () {
        router.push({ name: 'whatsappGroups.view', params: { whatsappGroupId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'whatsappGroups.edit', params: { whatsappGroupId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteWhatsappGroup(rowData.id))
      });

      if (user.can('whatsappGroups.view')) {
        buttonsHolder.append(showButton)
      }

      if (user.can('whatsappGroups.update')) {
        buttonsHolder.append(editButton)
      }

      if (user.can('whatsappGroups.delete')) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('whatsappGroups.list') || isMyIndex">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 v-if="isMyIndex" class="mr-auto text-lg font-medium">Whatsapp Gruplarım</h2>
      <h2 v-else-if="props.courseName" class="mr-auto text-lg font-medium">{{ props.courseName }} Kursunun Whatsapp Grupları</h2>
      <h2 v-else class="mr-auto text-lg font-medium">Tüm Whatsapp Grupları</h2>
      <div v-if="user.can('whatsappGroups.create') && !isMyIndex" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'whatsappGroups.create', query: {courseId: props.courseId} }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Whatsapp Grubu Ekle
          </Button>
        </RouterLink>
      </div>
    </div>
    <datatable ref="tableRef" :index-url="whatsappGroupIndexUrl" :columns="tableColumns" />
  </div>
</template>

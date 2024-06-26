<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, onBeforeMount, watch, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useCommentsStore } from "@/stores/comment";
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"
import { useAlertStore } from "@/stores/alert";

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref()
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const commentStore = useCommentsStore()
const commentIndexUrl = ref('')
const isUnapprovedIndex = ref(false)
const isMyIndex = ref(false)

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
  isUnapprovedIndex.value = !!route.meta?.unapproved
  isMyIndex.value = !!route.meta?.isMyIndex

  if (isMyIndex.value) {
    commentIndexUrl.value = commentStore.getMyIndexURL
  } else {
    commentIndexUrl.value = isUnapprovedIndex.value ? commentStore.getUnapprovedIndexURL : commentStore.getIndexURL
  }
}

const deleteComment = async (commentId) => {
  if (await commentStore.deleteComment(commentId)) {
    successNotificationToggle('İşlem Başarılı', 'Yorum Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Yorum Silinemedi!')
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
    title: "Kurs Tipi",
    responsive: 1,
    width: 170,
    field: "course_type.name",
    vertAlign: "middle",
    headerSort: false
  },
  {
    title: "Yorum Yapan",
    responsive: 2,
    width: 140,
    field: "commented_by.id",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const commented_by = rowData.commented_by
      const genderImage = commented_by.gender === 'male' ? maleProfile :
        (commented_by.gender === 'female' ? femaleProfile : userProfile)

      return `<img alt="WhatsHafız Panel Kullanıcısı" class="rounded-full w-5 mr-2" src="${genderImage}" /> ` +
        commented_by.name + ' ' + commented_by.surname;
    },
  },
  {
    title: "Başlık",
    responsive: 3,
    minWidth: 130,
    field: "title",
    vertAlign: "middle",
  },
  {
    title: "Yorum Zamanı",
    responsive: 4,
    width: 155,
    field: "created_at",
    vertAlign: "middle",
  },
  {
    title: "Durum",
    responsive: 5,
    width: 100,
    field: "is_approved",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      return `<div class="flex items-center lg:justify-center ${rowData.is_approved ? "text-success" : "text-danger"}">
          </i> ${rowData.is_approved ? "Onaylı" : "Bekliyor"}
        </div>`;
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
        router.push({ name: 'comments.view', params: { commentId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'comments.edit', params: { commentId: rowData.id } })
      });
      deleteButton.addEventListener("click", function () {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteComment(rowData.id))
      });

      buttonsHolder.append(showButton)

      if (user.can('comments.update') || (rowData.commented_by_id === user.profile.id && !rowData.is_approved)) {
        buttonsHolder.append(editButton)
      }

      if (user.can('comments.delete') || (rowData.commented_by_id === user.profile.id && !rowData.is_approved)) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('comments.list') || isMyIndex">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 v-if="isMyIndex" class="mr-auto text-lg font-medium">Yorumlarım</h2>
      <h2 v-else-if="isUnapprovedIndex" class="mr-auto text-lg font-medium">Onay Bekleyen Yorumlar</h2>
      <h2 v-else class="mr-auto text-lg font-medium">Tüm Yorumlar</h2>
      <div v-if="isMyIndex" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'comments.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Yorum Ekle
          </Button>
        </RouterLink>
      </div>
    </div>
    <datatable ref="tableRef" :index-url="commentIndexUrl" :columns="tableColumns" />
  </div>
</template>

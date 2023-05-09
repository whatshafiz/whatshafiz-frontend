<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useComplaintsStore } from "@/stores/complaint";
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

const tableRef = ref();
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const complaintStore = useComplaintsStore()
const complaintIndexUrl = ref('')
const isUnresolvedIndex = ref(false)
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
  isUnresolvedIndex.value = !!route.meta?.unresolved
  isMyIndex.value = !!route.meta?.isMyIndex

  if (isMyIndex.value) {
    complaintIndexUrl.value = complaintStore.getMyIndexURL
  } else {
    complaintIndexUrl.value = isUnresolvedIndex.value ? complaintStore.getUnresolvedIndexURL : complaintStore.getIndexURL
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
    title: "Şikayet Eden",
    responsive: 1,
    width: 140,
    field: "created_user_id",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const created_user = rowData.created_user
      const genderImage = created_user.gender === 'male' ? maleProfile :
        (created_user.gender === 'female' ? femaleProfile : userProfile)

      return `<img alt="WhatsHafız Panel Kullanıcısı" class="rounded-full w-5 mr-2" src="${genderImage}" /> ` +
        created_user.name + ' ' + created_user.surname;
    },
  },
  {
    title: "Konu",
    responsive: 2,
    minWidth: 130,
    field: "subject",
    vertAlign: "middle",
  },
  {
    title: "Şikayet Zamanı",
    responsive: 3,
    width: 155,
    field: "created_at",
    vertAlign: "middle",
  },
  {
    title: "Şikayet Edilen",
    responsive: 4,
    width: 150,
    field: "course.name",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const related_user = rowData.related_user

      if (related_user === null) {
        return ''
      }

      const genderImage = related_user.gender === 'male' ? maleProfile :
        (related_user.gender === 'female' ? femaleProfile : userProfile)

      return `<img alt="WhatsHafız Panel Kullanıcısı" class="rounded-full w-5 mr-2" src="${genderImage}" /> ` +
        related_user.name + ' ' + related_user.surname;
    },
  },
  {
    title: "Şikayetle İlgilenen",
    responsive: 5,
    width: 170,
    field: "users_count",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const reviewed_user = rowData.reviewed_user

      if (reviewed_user === null) {
        return ''
      }

      const genderImage = reviewed_user.gender === 'male' ? maleProfile :
        (reviewed_user.gender === 'female' ? femaleProfile : userProfile)

      return `<img alt="WhatsHafız Panel Kullanıcısı" class="rounded-full w-5 mr-2" src="${genderImage}" /> ` +
        reviewed_user.name + ' ' + reviewed_user.surname;
    },
  },
  {
    title: "Durum",
    responsive: 6,
    width: 100,
    field: "is_resolved",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      return `<div class="flex items-center lg:justify-center ${rowData.is_resolved ? "text-success" : "text-danger"}">
          </i> ${rowData.is_resolved ? "Çözüldü" : "Bekliyor"}
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

      showButton.addEventListener("click", function () {
        router.push({ name: 'complaints.view', params: { complaintId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'complaints.edit', params: { complaintId: rowData.id } })
      });

      if (user.can('complaints.view') || isMyIndex) {
        buttonsHolder.append(showButton)
      }

      if (user.can('complaints.update')) {
        buttonsHolder.append(editButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('complaints.list') || isMyIndex">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 v-if="isMyIndex" class="mr-auto text-lg font-medium">Şikayetlerim</h2>
      <h2 v-else-if="isUnresolvedIndex" class="mr-auto text-lg font-medium">Çözüm Bekleyen Şikayetler</h2>
      <h2 v-else class="mr-auto text-lg font-medium">Tüm Şikayetler</h2>
      <div v-if="isMyIndex" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'complaints.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Şikayet Kaydı Oluştur
          </Button>
        </RouterLink>
      </div>
    </div>
    <datatable ref="tableRef" :index-url="complaintIndexUrl" :columns="tableColumns" />
  </div>
</template>

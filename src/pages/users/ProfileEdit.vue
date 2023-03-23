<script setup lang="ts">
import {
    FormSwitch,
    FormLabel,
    FormInput,
    FormTextarea,
} from "@/base-components/Form";
import Button from "@/base-components/Button";
import Notification from "@/base-components/Notification";
import Lucide from "@/base-components/Lucide";
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from "@/base-components/TomSelect";
import Toastify from "toastify-js";
import { reactive, toRefs, ref, onMounted, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useCountryStore } from "@/stores/country";
import { useUniversityStore } from "@/stores/university";
import { storeToRefs } from "pinia"

const isLoading = ref(false)
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const countryStore = useCountryStore()
const universityStore = useUniversityStore()

const countries = ref([])
const cities = ref([])
const universities = ref([])
const faculties = ref([])
const departments = ref([])

const fetchCountryCities = async (countryId) => {
    cities.value = await countryStore.fetchCountryCities(countryId)
}

const fetchUniversityFaculties = async (universityId) => {
    faculties.value = await universityStore.fetchUniversityFaculties(universityId)
}

const fetchUniversityFacultyDepartments = async (universityId, facultyId) => {
    if (universityId && facultyId) {
        departments.value = await universityStore.fetchUniversityFacultyDepartments(universityId, facultyId)
    }
}


onMounted(async () => {
    await countryStore.fetchCountries()
    countries.value = countryStore.getCountries

    await universityStore.fetchUniversities()
    universities.value = universityStore.getUniversities

    if (profile.value.country_id) {
        fetchCountryCities(profile.value.country_id)
    }

    if (profile.value.university_id) {
        fetchUniversityFaculties(profile.value.university_id)
    }

    if (profile.value.university_faculty_id) {
        fetchUniversityFacultyDepartments(profile.value.university_id, profile.value.university_faculty_id)
    }
})

const onSubmit = async () => {
    isLoading.value = true

    try {
        await userStore.saveProfile()
        await userStore.fetchProfile()
        isLoading.value = false
    } catch (response) {
        console.log(response)
        isLoading.value = false
    }
};

</script>

<template>
    <div class="flex items-center mt-8 intro-y">
        <h2 class="mr-auto text-lg font-medium">Profil Bilgileri</h2>
    </div>
    <!-- BEGIN: Page Layout -->
    <div class="grid grid-cols-12 gap-6 mt-5">
        <div class="col-span-12 intro-y lg:col-span-6">
            <!-- BEGIN: Form Validation -->
            <div class="intro-y box">
                <div
                    class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                    <h2 class="mr-auto text-base font-medium">Profil</h2>
                </div>
                <div class="p-5">
                    <!-- BEGIN: Validation Form -->
                    <form class="validate-form" @submit.prevent="onSubmit">
                        <div class="input-form">
                            <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                                Ad
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <FormInput id="name" v-model="profile.name" type="text" name="name" placeholder="Adınız" />
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="surname" class="flex flex-col w-full sm:flex-row">
                                Soyad
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <FormInput id="surname" v-model="profile.surname" type="text" name="surname"
                                placeholder="Soyadınız" />
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="phone_number" class="flex flex-col w-full sm:flex-row">
                                Telefon No
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Değiştirilemez
                                </span>
                            </FormLabel>
                            <FormInput id="phone_number" v-model="profile.phone_number" type="text" name="phone_number"
                                readonly placeholder="Telefon No" />
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="gender" class="flex flex-col w-full sm:flex-row">
                                Cinsiyet
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <TomSelect id="gender" v-model="profile.gender" :options="{ placeholder: 'Cinsiyet Seçin' }"
                                class="w-full">
                                <option value="male">Erkek</option>
                                <option value="female">Kadın</option>
                            </TomSelect>
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="email" class="flex flex-col w-full sm:flex-row">
                                E-posta
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    İsteğe Bağlı
                                </span>
                            </FormLabel>
                            <FormInput id="email" v-model="profile.email" type="email" name="email"
                                placeholder="ornek@gmail.com" />
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="country_id" class="flex flex-col w-full sm:flex-row">
                                Ülke
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <TomSelect id="country_id" v-model="profile.country_id" :options="{
                                placeholder: 'Ülke Seçin',
                                onChange: (newCountryId) => { fetchCountryCities(newCountryId) },
                            }" class="w-full">
                                <option v-for="country in countries" :key="country.id" :value="country.id">
                                    {{ country.name }}
                                </option>
                            </TomSelect>
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="city_id" class="flex flex-col w-full sm:flex-row">
                                Şehir
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <TomSelect id="city_id" name="city_id" v-model="profile.city_id" :options="{
                                placeholder: 'Şehir Seçin',
                                maxOptions: 100,
                                create: async (newCityName) => {
                                    const newCityId = (await countryStore.createCity(profile.country_id, newCityName)).city.id
                                    cities = await countryStore.fetchCountryCities(profile.country_id)
                                    profile.city_id = newCityId

                                    return true
                                },
                                render: {
                                    'option_create': (data: TomOption, escape: typeof escape_html) => {
                                        return '<div class=\'create !p-4\'>Yeni Şehir Oluştur: <strong>' + escape(data.input) + '</strong></div>';
                                    },
                                }
                            }" :create="true">
                                <option v-for="city in cities" :key="city.id" :value="city.id">
                                    {{ city.name }}
                                </option>
                            </TomSelect>
                        </div>
                        <div class="mt-3 input-form">
                            <FormLabel htmlFor="university_id" class="flex flex-col w-full sm:flex-row">
                                Üniversite
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <TomSelect id="university_id" name="university_id" v-model="profile.university_id" :options="{
                                placeholder: 'Üniversite Seçin',
                                onChange: (universityId) => { fetchUniversityFaculties(universityId) },
                                create: async (newUniversityName) => {
                                    const newUniversityId = (await universityStore.createUniversity(newUniversityName)).university.id
                                    universities = await universityStore.fetchUniversities()
                                    profile.university_id = newUniversityId
                                    profile.university_faculty_id = null
                                    profile.university_department_id = null
                                    faculties = []
                                    departments = []

                                    return true
                                },
                                render: {
                                    'option_create': (data: TomOption, escape: typeof escape_html) => {
                                        return '<div class=\'create !p-4\'>Yeni Üniversite Oluştur: <strong>' + escape(data.input) + '</strong></div>';
                                    },
                                }
                            }" :create="true">
                                <option v-for="university in universities" :key="university.id" :value="university.id">
                                    {{ university.name }}
                                </option>
                            </TomSelect>
                        </div>
                        <div class="mt-3 input-form" v-if="profile.university_id">
                            <FormLabel htmlFor="university_faculty_id" class="flex flex-col w-full sm:flex-row">
                                Fakülte
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <TomSelect id="university_faculty_id" name="university_faculty_id"
                                v-model="profile.university_faculty_id" :options="{
                                    placeholder: 'Fakülte Seçin',
                                    onChange: (facultyId) => { fetchUniversityFacultyDepartments(profile.university_id, facultyId) },
                                    create: async (newFacultyName) => {
                                        const newFacultyId = (await universityStore.createUniversityFaculty(profile.university_id, newFacultyName)).faculty.id
                                        faculties = await universityStore.fetchUniversityFaculties(profile.university_id)
                                        profile.university_faculty_id = newFacultyId
                                        profile.university_department_id = null
                                        departments = []

                                        return true
                                    },
                                    render: {
                                        'option_create': (data: TomOption, escape: typeof escape_html) => {
                                            return '<div class=\'create !p-4\'>Yeni Fakülte Oluştur: <strong>' + escape(data.input) + '</strong></div>';
                                        },
                                    }
                                }" :create="true">
                                <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
                                    {{ faculty.name }}
                                </option>
                            </TomSelect>
                        </div>
                        <div class="mt-3 input-form" v-if="profile.university_faculty_id">
                            <FormLabel htmlFor="university_department_id" class="flex flex-col w-full sm:flex-row">
                                Üniversite Bölümü
                                <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                                    Zorunlu
                                </span>
                            </FormLabel>
                            <TomSelect id="university_department_id" name="university_department_id"
                                v-model="profile.university_department_id" :options="{
                                    placeholder: 'Bölüm Seçin',
                                    create: async (newDepartmentName) => {
                                        const newDepartmentId = (await universityStore.createUniversityFacultyDepartment(profile.university_id, profile.university_faculty_id, newDepartmentName)).department.id
                                        departments = await universityStore.fetchUniversityFacultyDepartments(profile.university_id, profile.university_faculty_id)
                                        profile.university_department_id = newDepartmentId

                                        return true
                                    },
                                    render: {
                                        'option_create': (data: TomOption, escape: typeof escape_html) => {
                                            return '<div class=\'create !p-4\'>Yeni Bölüm Oluştur: <strong>' + escape(data.input) + '</strong></div>';
                                        },
                                    }
                                }" :create="true">
                                <option v-for="department in departments" :key="department.id" :value="department.id">
                                    {{ department.name }}
                                </option>
                            </TomSelect>
                        </div>
                        <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                            <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                            Kaydet
                        </Button>
                        <RouterLink :to="{ name: 'profile' }">
                            <Button variant="outline-secondary" type="button" class="mt-5 mr-5">
                                İptal
                            </Button>
                        </RouterLink>
                    </form>
                </div>
            </div>
            <!-- END: Form Validation -->
            <!-- BEGIN: Success Notification Content -->
            <Notification id="success-notification-content" class="flex hidden">
                <Lucide icon="CheckCircle" class="text-success" />
                <div class="ml-4 mr-4">
                    <div class="font-medium">Registration success!</div>
                    <div class="mt-1 text-slate-500">
                        Please check your e-mail for further info!
                    </div>
                </div>
            </Notification>
            <!-- END: Success Notification Content -->
            <!-- BEGIN: Failed Notification Content -->
            <Notification id="failed-notification-content" class="flex hidden">
                <Lucide icon="XCircle" class="text-danger" />
                <div class="ml-4 mr-4">
                    <div class="font-medium">Registration failed!</div>
                    <div class="mt-1 text-slate-500">Please check the fileld form.</div>
                </div>
            </Notification>
            <!-- END: Failed Notification Content -->
        </div>
    </div>
    <!-- END: Page Layout -->
</template>

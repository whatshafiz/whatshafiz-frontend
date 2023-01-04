<template>
  <div>
    <DarkModeSwitcher  class="hidden xl:flex" />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-3  ">
        <!-- BEGIN: Register Info -->
        <LoginLeft  />
        <!-- END: Register Info -->
        <!-- BEGIN: Register Form -->
        <div class="h-full xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
          class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-3/4 xl:w-3/4">
          <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
           Profili Tamamla
         </h2>

         <div class="flex items-center justify-start gap-2 flex-col w-full">
          <div class="w-full mb-2">
            <label class="form-label ml-2 mb-0 mt-1">İsim</label>
            <input type="text" class="form-control req" v-model="form.name" />
          </div>

          <div class="w-full mb-2">
            <label class="form-label ml-2 mb-0 mt-1">Soyisim</label>
            <input type="text" class="form-control req" v-model="form.surname" />
          </div>

          <div class="w-full mb-2">
            <label class="form-label ml-2 mb-0 mt-1">E-Posta</label>
            <input type="text" class="form-control req" v-model="form.email" />
          </div>


          <div class="w-full mb-2">
            <label class="form-label ml-2 mb-0 mt-1">Cinsiyet</label>
            <select class="form-select mt-2 sm:mr-2 req" v-model="form.gender" id="">
              <option value="">Seçiniz</option>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
            </select>
          </div>


          <div class="w-full mb-2">
            <label class="form-label ml-2 mb-0 mt-1">Ülke</label>
            <select class="form-select mt-2 sm:mr-2 req" v-model="form.country_id" @change="checkCityList()">
              <option :value="item.id" v-for="item in countries" :key="'ctr'+item.id">{{item.name}}</option>

            </select>
          </div>


          <div class="w-full mb-2" v-if="list_city">
            <label class="form-label ml-2 mb-0 mt-1">Şehir</label>
            <select class="form-select mt-2 sm:mr-2 req" v-model="form.city_id" >
              <option value="">Seçiniz</option>
              <option :value="item.id" v-for="item in cities" :key="'cty'+item.id">{{item.name}}</option>

            </select>
          </div>

          <div class="w-full mb-2" v-else>
            <label class="form-label ml-2 mb-0 mt-1">Şehir</label>
            <div class="w-full relative">
              <input type="text" class="form-control" v-model="form.city_id"  placeholder="Şehir adı giriniz..." />
              <button class="absolute right-1 top-[3px] bg-success text-white rounded-md p-2" @click="saveManuel('city')"><SaveIcon class="w-4 h-4"/></button>
            </div>
            <p class="w-full py-1 text-slate-500 text-xs pl-2">Şehir adı yazdıktan sonra kaydetmelisiniz.</p>
          </div>



          <div class="w-full mb-2" v-if="list_uni">
            <label class="form-label ml-2 mb-0 mt-1">Üniversite</label>
            <select class="form-select mt-2 sm:mr-2 req" v-model="form.university_id" @change="getFaculties()">
             <option value="">Seçiniz</option>
             <option :value="item.id" v-for="item in universities" :key="'ctr'+item.id">{{item.name}}</option>
             <option value="-1">Diğer</option>
           </select>
         </div>

         <div class="w-full mb-2" v-else>
          <label class="form-label ml-2 mb-0 mt-1">Üniversite</label>
          <div class="w-full relative">
            <input type="text" class="form-control" v-model="form.university_id"  placeholder="Üniversite adı giriniz..." />
            <button class="absolute right-1 top-[3px] bg-success text-white rounded-md p-2" @click="saveManuel('university')"><SaveIcon class="w-4 h-4"/></button>
          </div>
          <p class="w-full py-1 text-slate-500 text-xs pl-2">Üniversite adı yazdıktan sonra kaydetmelisiniz.</p>
        </div>



        <div class="w-full mb-2" v-if="list_fkl">
          <label class="form-label ml-2 mb-0 mt-1">Fakülte</label>
          <select class="form-select mt-2 sm:mr-2 req" v-model="form.university_faculty_id" @change="getDepartments()">
           <option value="">Seçiniz</option>
           <option :value="item.id" v-for="item in faculties" :key="'ctr'+item.id">{{item.name}}</option>
           <option value="-1">Diğer</option>

         </select>
       </div>


       <div class="w-full mb-2" v-else>
        <label class="form-label ml-2 mb-0 mt-1">Fakülte</label>
        <div class="w-full relative">
          <input type="text" class="form-control" v-model="form.university_faculty_id"  placeholder="Fakülte adı giriniz..." />
          <button class="absolute right-1 top-[3px] bg-success text-white rounded-md p-2" @click="saveManuel('faculty')"><SaveIcon class="w-4 h-4"/></button>
        </div>
        <p class="w-full py-1 text-slate-500 text-xs pl-2">Fakülte adı yazdıktan sonra kaydetmelisiniz.</p>
      </div>



      <div class="w-full mb-2" v-if="list_dep">
        <label class="form-label ml-2 mb-0 mt-1">Bölüm</label>
        <select class="form-select mt-2 sm:mr-2 req" v-model="form.university_department_id" @change="checkDep()">
         <option value="">Seçiniz</option>
         <option :value="item.id" v-for="item in departments" :key="'ctr'+item.id">{{item.name}}</option>
         <option value="-1">Diğer</option>

       </select>
     </div>



     <div class="w-full mb-2" v-else>
      <label class="form-label ml-2 mb-0 mt-1">Bölüm</label>
      <div class="w-full relative">
        <input type="text" class="form-control" v-model="form.university_department_id"  placeholder="Bölüm adı giriniz..." />
        <button class="absolute right-1 top-[3px] bg-success text-white rounded-md p-2" @click="saveManuel('department')"><SaveIcon class="w-4 h-4"/></button>
      </div>
      <p class="w-full py-1 text-slate-500 text-xs pl-2">Bölüm adı yazdıktan sonra kaydetmelisiniz.</p>
    </div>


    <button class="btn btn-primary py-3 px-4 relative w-3/4 md:w-1/2 mt-3 xl:mt-0 flex items-center justify-center gap-3 text-lg rounded-xl" @click="saveProfil"><SaveIcon class="w-6 h-6 "/> Kaydet</button>

  </div>

</div>
</div>
<!-- END: register Form -->
</div>
</div>


</div>


</template>

<script>
  import { onMounted, reactive, toRefs ,ref} from "vue";
  import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
  import LoginLeft from "@/components/customs/login-left.vue";
  import dom from "@left4code/tw-starter/dist/js/dom";
  import { def } from "@vue/shared";
  import axios from "axios";

  import { useAuthStore } from "@/stores/auth";
  import { mapStores } from 'pinia';
  import { useRoute } from 'vue-router';


  export default {
    setup() {
      const authStore = useAuthStore();
      const bodyChange = onMounted(() => {
        dom("body").removeClass("main").removeClass("error-page").addClass("login");
      });



      const route = useRoute()
      const program_type = ref(route.query.type);

      const staticBackdropModalPreview = ref(true);

      return { authStore, bodyChange,program_type,staticBackdropModalPreview };


    },
    mounted() {
      this.getCountry();
      this.getCity();
      this.getUniversities();

    },


    data() {
      return {

        form: {
          name: '',
          surname: '',
          email: '',
          gender: '',
          country_id: 1,
          city_id: '',
          university_id: "",
          university_faculty_id: "",
          university_department_id: ""
        },


        countries: [],
        cities: [],
        universities: [],
        faculties: [],
        departments: [],
        list_city: true,
        list_uni: true,
        list_fkl: true,
        list_dep: true,

      }
    },
    components: {

      DarkModeSwitcher,
      LoginLeft
    },

    methods: {

      checkCityList(){
        if (this.form.country_id !== 1) {
          this.list_city = false;
        }
      },

      async getUniversities() {


       await axios.get("/universities").then(response => {

        this.universities = response.data.universities;

      }).catch(error => {
        console.log(error);
      });

    },   


    async getFaculties() {


      if (this.form.university_id == -1) {

        this.form.university_id = ""
        this.form.university_faculty_id = ""
        this.form.university_department_id = ""
        this.list_uni = false;
        this.list_fkl = false;
        this.list_dep = false;

        return;
      }


      await axios.get("/universities/"+this.form.university_id+"/faculties").then(response => {

        this.faculties = response.data.faculties;

      }).catch(error => {
        console.log(error);
      });

    },   


    async getDepartments() {


     if (this.form.university_faculty_id == -1) {

      this.form.university_faculty_id = ""

      this.form.university_department_id = ""

      this.list_fkl = false;
      this.list_dep = false;

      return;
    }


    await axios.get("/universities/"+this.form.university_id+"/faculties/"+this.form.university_faculty_id+"/departments").then(response => {

      this.departments = response.data.departments;

    }).catch(error => {
      console.log(error);
    });

  },   

  async checkDep() {


   if (this.form.university_department_id == -1) {

    this.form.university_department_id = ""

    this.list_dep = false;

    return;
  }
},



async getCountry() {


 await axios.get("/countries").then(response => {

  this.countries = response.data.countries;

}).catch(error => {
  console.log(error);
});

},

async getCity() {


 await axios.get("/countries/"+this.form.country_id+"/cities").then(response => {

  this.cities = response.data.cities;

}).catch(error => {
  console.log(error);
});

},


async saveManuel(input) {

  if (input == "university") {

    await axios.post("/universities", { name: this.form.university_id }).then(response => {

      this.form.university_id = response.data.university.id;
      this.getUniversities();
      this.list_uni = true;

    }).catch(error => {
      console.log(error);
    });

  }

  if (input == "faculty") {

    await axios.post("/universities/"+this.form.university_id+"/faculties", { name: this.form.university_faculty_id }).then(response => {

      this.form.university_faculty_id = response.data.faculty.id;
      this.getFaculties();
      this.list_fkl = true;

    }).catch(error => {
      console.log(error);
    });

  }

  if (input == "city") {

    await axios.post("/countries/"+this.form.country_id+"/cities", { name: this.form.city_id }).then(response => {

      this.form.city_id = response.data.city.id;
      this.getCity()
      this.list_city = true;

    }).catch(error => {
      console.log(error);
    });

  }

  if (input == "department") {

    await axios.post("/universities/"+this.form.university_id+"/faculties/"+this.form.university_faculty_id+"/departments", { name: this.form.university_department_id }).then(response => {

      this.form.university_department_id = response.data.department.id;
      this.getDepartments();
      this.list_dep = true;

    }).catch(error => {
      console.log(error);
    });

  }

},


async saveProfil(){

  const validating = await this.validate_custom('req');

  if (validating) {

    await axios.put("/profile", this.form).then(response => {

    //  console.log(response.data);

     this.$router.push({ name: 'home' });

   }).catch(error => {
    console.log(error);
  });

 }else{
  this.error_toast = "Lütfen tüm alanları doldurunuz";
}

},


validate_custom (className) {
  const req = document.querySelectorAll('.' + className)

  let validating = true

  req.forEach((item, index) => {
    if (item.value == '') {
      item.classList.remove('border-2')
      item.classList.remove('border-green-500')
      item.classList.add('border-2')
      item.classList.add('border-rose-600')
      item.focus()
      validating = false
    } else {
      item.classList.add('border-2')
      item.classList.add('border-green-500')
      item.classList.remove('border-2')
      item.classList.remove('border-rose-600')
    }
  })

  return validating
},


}
}



</script>
<style>
  .tom-select .ts-input .item {
    line-height: 30px!important;
  }

  .tom-select .ts-input {
    min-height: 46px !important;
  }

  .login__input{
    min-width: 250px!important;
  }

  @media (max-width: 768px) {
    body.login{
      overflow: auto!important;
    }
  }

</style>

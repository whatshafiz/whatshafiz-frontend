<template>
  <!-- BEGIN: Top Bar -->
  <div
  class="top-bar-boxed h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700"
  >
  <div class="h-full flex items-center">
    <!-- BEGIN: Logo -->
    <a href="" class="logo -intro-x hidden md:flex xl:w-[180px] block">
      <img
      :alt="title"
      class="logo__image w-6"
      src="@/assets/images/logo.svg"
      />
      <span class="logo__text text-white text-lg ml-3"> {{title}} </span>
    </a>
    <!-- END: Logo -->
    <!-- BEGIN: Breadcrumb -->
    <nav aria-label="breadcrumb" class="-intro-x h-[45px] mr-auto">
      <ol class="breadcrumb breadcrumb-light">
        <li class="breadcrumb-item"><a href="#">Anasayfa</a></li>
        <li class="breadcrumb-item active" aria-current="page">Panelim</li>
      </ol>
    </nav>
    <!-- END: Breadcrumb -->
    <!-- BEGIN: Search -->
    <div class="intro-x relative mr-3 sm:mr-6">
      <div class="search hidden sm:block">
        <input
        type="text"
        class="search__input form-control border-transparent"
        placeholder="Arama..."
        @focus="showSearchDropdown"
        @blur="hideSearchDropdown"
        />
        <SearchIcon class="search__icon dark:text-slate-500" />
      </div>
      <a class="notification notification--light sm:hidden" href="">
        <SearchIcon class="notification__icon dark:text-slate-500" />
      </a>
      <div class="search-result" :class="{ show: searchDropdown }">
        <div class="search-result__content">
          liste
        </div>
      </div>
    </div>
    <!-- END: Search -->
    <!-- BEGIN: Notifications -->
    <Dropdown class="intro-x mr-4 sm:mr-6">
      <DropdownToggle
      tag="div"
      role="button"
      class="notification notification--bullet cursor-pointer"
      >
      <BellIcon class="notification__icon dark:text-slate-500" />
    </DropdownToggle>
    <DropdownMenu class="notification-content pt-2">
      <DropdownContent tag="div" class="notification-content__box">
        <div class="notification-content__title">Bildirimler</div>
        <div  class="cursor-pointer relative flex items-center">
         Bildirim Listesi
       </div>
     </DropdownContent>
   </DropdownMenu>
 </Dropdown>
 <!-- END: Notifications -->
 <!-- BEGIN: Account Menu -->
 <Dropdown class="intro-x w-8 h-8">
  <DropdownToggle
  tag="div"
  role="button"
  class="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
  >
  <img alt="user bilgi" src="https://btapi.btmobilmarket.com/api/user/userThumb/Muhammed/Hunkar" />
</DropdownToggle>
<DropdownMenu class="w-56">
  <DropdownContent
  class="bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
  >
  <DropdownHeader tag="div" class="!font-normal">
    <div class="font-medium">
      Muhammed Hunkar
    </div>
    <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
      Öğrenci
    </div>
  </DropdownHeader>
  <DropdownDivider class="border-white/[0.08]" />
  <DropdownItem class="dropdown-item hover:bg-white/5">
    <UserIcon class="w-4 h-4 mr-2" /> Profil</DropdownItem
    >
    <DropdownItem class="dropdown-item hover:bg-white/5">
      <EditIcon class="w-4 h-4 mr-2" /> Ayarlar</DropdownItem
      >
      <DropdownItem class="dropdown-item hover:bg-white/5">
        <LockIcon class="w-4 h-4 mr-2" /> Cezalar</DropdownItem
        >
        <DropdownItem class="dropdown-item hover:bg-white/5">
          <HelpCircleIcon class="w-4 h-4 mr-2" /> Görevlerim</DropdownItem
          >
          <DropdownDivider class="border-white/[0.08]" />
          <DropdownItem class="dropdown-item hover:bg-white/5" @click="useAuthStore().destroyToken()" >
            <ToggleRightIcon class="w-4 h-4 mr-2" /> Çıkış</DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>

<script setup>
  import { ref } from "vue";
  import { useAuthStore } from "@/stores/auth";



  const searchDropdown = ref(false);
  const title = import.meta.env.VITE_SITE_NAME;
  const showSearchDropdown = () => {
    searchDropdown.value = true;
  };
  const hideSearchDropdown = () => {
    searchDropdown.value = false;
  }; 

</script>

<template>

    <div class="hidden xl:flex flex-col min-h-screen">
        <a href="" class="-intro-x flex items-center pt-5">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" src="@/assets/images/logo.svg" />
            <span class="text-white text-lg ml-3"> {{ title }} </span>
        </a>
        <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="-intro-x w-1/2 -mt-16"
                src="https://www.kuranmektebi.net/designApp/assets/images/stickers/png/15.png" />
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                <b> {{ title }}</b>
            </div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                Online Hafızlık Takip Sistemi
            </div>
        </div>
    </div>

</template>

<script>
export default {
    name: 'WhPanelLoginLeft',

    data() {
        return {
            title: import.meta.env.VITE_SITE_NAME
        };
    },

    mounted() {

    },

    methods: {

    },
};
</script>

<style scoped>

</style>
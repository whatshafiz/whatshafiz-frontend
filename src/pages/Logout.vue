<script setup async lang="ts">
import { onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore()

onBeforeMount(async () => {
  user.logout()
})
</script>

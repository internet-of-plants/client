<template>
  <div id="nav" class="w-full text-center pt-5">
    <router-link v-if="isAuthenticated" class="link text-xl" :class="selected('Organizations')" to="/">All Organizations</router-link>
    <router-link v-if="isAuthenticated && organizationId" class="link text-xl" :class="selected('Organization')" :to="`/organization/${organizationId}`">Current Organization</router-link>
    <router-link v-if="isAuthenticated && collectionId" class="link text-xl" :class="selected('Collection')" :to="`/organization/${organizationId}/collection/${collectionId}`">Current Collection</router-link>
    <router-link v-if="!isAuthenticated" class="link text-xl" :class="selected('Login')" to="/login">Login</router-link>
    <router-link v-if="!isAuthenticated" class="link text-xl" :class="selected('Signup')" to="/signup">Signup</router-link>
    <slot name="router"></slot>
  </div>
  <div class="content">
    <router-view />
  </div>
  <div class="flex flex-col w-full footer">
    <a href="https://www.flaticon.com/free-icons/soil" title="soil icons">Soil icons created by Smashicons - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/hot" title="hot icons">Hot icons created by Freepik - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/evaporation" title="evaporation icons">Evaporation icons created by Smashicons - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/plant" title="plant icons">Plant icons created by Freepik - Flaticon</a>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import '@/tailwind.css';
import { useRoute } from "vue-router";

const organizationId = computed(() => useRoute().params.organizationId);
const collectionId = computed(() => useRoute().params.collectionId);
const deviceId = computed(() => useRoute().params.deviceId);

const selected = (route) => {
  switch (route) {
    case "Organizations":
      if (!organizationId.value) {
        return ["selected"];
      }
      break;
    case "Organization":
      if (organizationId.value && !collectionId.value) {
        return ["selected"];
      }
      break;
    case "Organization":
      if (collectionId.value && !deviceId.value) {
        return ["selected"];
      }
      break;
    case "Signup":
      if (useRoute().path === "/signup") {
        return ["selected"];
      }
      break;
    case "Login":
      if (useRoute().path === "/login") {
        return ["selected"];
      }
      break;
  }
  return [];
};

const isAuthenticated = ref(!!localStorage.getItem("token"));
const updateAuthenticated = () => {
  isAuthenticated.value = !!localStorage.getItem("token");
};
onMounted(() => window.addEventListener("storage", updateAuthenticated));
onUnmounted(() => window.removeEventListener("storage", updateAuthenticated));
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #DFDFDF;
  color: #626262;
  overflow: none;
  height: 100vh;
  padding: 0;
  margin: 0;
}
input {
  background-color: #DFDFDF;
  border: solid 1px #626262;
  border-radius: 3px;
  padding-left: 5px;
}
.link {
  padding: 30px;
  text-align: center;
}
.content {
  height: calc(100vh - 17em);
  overflow-x: scroll;
}
.selected {
  color: green;
}
.footer {
  height: 7em;
}
#nav {
  height: 10em;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.vc-color-wrap {
  height: 20px !important;
}
</style>

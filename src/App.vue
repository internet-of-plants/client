<template>
  <div id="nav" class="mt-5">
    <router-link v-if="useRoute().path === '/'" class="link text-xl" to="/">All Organizations</router-link>
    <!--<router-link class="link" to="/sensor/prototypes">Sensor Prototypes</router-link>-->
    <!--<router-link class="link" to="/target/prototypes">Target Prototypes</router-link>-->
    <!--<router-link class="link" to="/compiler/create">Create compiler</router-link>-->
    <!--<router-link class="link" to="/compilations">Compilations</router-link>-->
  </div>
  <router-view/>
  <div class="flex flex-col">
    <a href="https://www.flaticon.com/free-icons/soil" title="soil icons">Soil icons created by Smashicons - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/hot" title="hot icons">Hot icons created by Freepik - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/evaporation" title="evaporation icons">Evaporation icons created by Smashicons - Flaticon</a>
    <a href="https://www.flaticon.com/free-icons/plant" title="plant icons">Plant icons created by Freepik - Flaticon</a>
  </div>
</template>

<script setup lang="ts">
import '@/tailwind.css';
import { useRoute } from "vue-router";
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.link {
  padding: 30px;
  text-align: center;
}
#nav {

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

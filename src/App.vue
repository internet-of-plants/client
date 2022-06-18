<template>
  <div id="nav">
    <router-link class="link" to="/">Organizations</router-link>
    <!--<router-link class="link" to="/sensor/prototypes">Sensor Prototypes</router-link>-->
    <!--<router-link class="link" to="/target/prototypes">Target Prototypes</router-link>-->
    <!--<router-link class="link" to="/compiler/create">Create compiler</router-link>-->
    <!--<router-link class="link" to="/compilations">Compilations</router-link>-->
  </div>
  <router-view/>
</template>

<style lang="scss" scoped>
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
</style>

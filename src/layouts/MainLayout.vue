<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      :mini="$q.platform.is.mobile ? true : false"
      v-model="leftDrawerOpen"
      :width="100"
      class="bg-blue-main"
      behavior="desktop"
    >
      <q-list>
        <q-item
          class="q-pt-md"
          clickable
          active-class="active-item"
          :active="$route.name == 'project'"
          to="/project"
        >
          <div align="center " style="width: 100%">
            <q-icon
              name="fab fa-hubspot"
              color="white"
              :size="$q.platform.is.desktop ? 'lg' : 'sm'"
            ></q-icon>
            <div class="text-white" :class="{ 'font-18': $q.platform.is.desktop }">
              Project
            </div>
          </div>
        </q-item>
        <q-item
          class="q-pt-md"
          clickable
          to="/monitor"
          active-class="active-item"
          :active="$route.name == 'monitor'"
        >
          <div align="center " style="width: 100%">
            <q-icon
              name="far fa-chart-bar"
              class=""
              color="white"
              :size="$q.platform.is.desktop ? 'lg' : 'sm'"
            ></q-icon>
            <div class="text-white" :class="{ 'font-18': $q.platform.is.desktop }">
              Monitor
            </div>
          </div>
        </q-item>
        <q-item
          class="q-pt-md"
          clickable
          @click="toSettings()"
          active-class="active-item"
          :active="$route.name == 'settings'"
        >
          <div align="center " style="width: 100%">
            <q-icon
              name="fas fa-cogs"
              class=""
              color="white"
              :size="$q.platform.is.desktop ? 'lg' : 'sm'"
            ></q-icon>
            <div class="text-white" :class="{ 'font-18': $q.platform.is.desktop }">
              Settings
            </div>
          </div>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "MainLayout",
  setup() {
    const leftDrawerOpen = ref(true);
    const router = useRouter();

    const toSettings = () => {
      //  to="/settings"
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // console.log("logged in");
          // User is signed in.
          router.push("/boxSettings");
        } else {
          router.push("/settings");
          // User is signed out.
        }
      });
    };

    return {
      leftDrawerOpen,
      toSettings,
    };
  },
};
</script>
<style>
.active-item {
  background-color: #00bfab;
}
</style>

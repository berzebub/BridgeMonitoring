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
          :active="$route.name == 'overAll'"
          to="/overAll"
        >
          <div align="center " style="width: 100%">
            <q-icon
              name="fab fa-hubspot"
              color="white"
              :size="$q.platform.is.desktop ? 'lg' : 'sm'"
            ></q-icon>
            <div class="text-white" :class="{ 'font-18': $q.platform.is.desktop }">
              Overall
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
          to="/settings"
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

export default {
  name: "MainLayout",
  setup() {
    const leftDrawerOpen = ref(true);

    return {
      leftDrawerOpen,
    };
  },
};
</script>
<style>
.active-item {
  background-color: #00bfab;
}
</style>

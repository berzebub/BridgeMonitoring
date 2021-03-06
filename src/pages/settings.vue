<template>
  <q-page class="q-page-color relative-position flex flex-center">
    <div style="width: 100%; max-width: 740px" class="row full-height">
      <div style="max-width: 300px; width: 100%" v-if="$q.platform.is.desktop">
        <q-img style="width: 100%" src="../../public/img/login.png"></q-img>
      </div>
      <div
        class="col"
        :style="
          $q.platform.is.desktop
            ? 'background-color: #020305; border-radius: 0px 20px 20px 0px'
            : null
        "
      >
        <div align="center" class="text-white q-pt-xl q-pb-lg">
          <span class="font-36"> SMART BHMS </span>
          <br />
          <span class="font-18"> Bridge Health Monitor System </span>
        </div>
        <div class="q-px-xl text-white">
          <q-input
            autofocus
            class="no-padding"
            dark
            :placeholder="usernamePlaceholder"
            label="Username"
            v-model="username"
          ></q-input>

          <div class="q-pt-md">
            <q-input
              dark
              label="Password"
              :placeholder="passwordPlaceholder"
              v-model="password"
            ></q-input>
          </div>
        </div>

        <div class="q-pt-lg" align="center">
          <q-btn
            dense=""
            label="Login"
            style="width: 200px"
            class="font-18 text-black"
            color="teal"
          ></q-btn>
        </div>
        <div class="text-white font-14" style="padding-top: 37px" align="center">
          TSPK Inspection & Consultant Co.,ltd
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const username = ref("");
    const password = ref("");

    return { username, password };
  },
};
</script>

<style lang="scss" scoped></style>

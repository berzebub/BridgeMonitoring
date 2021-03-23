<template>
  <q-page
    class="relative-position flex flex-center"
    :class="$q.platform.is.desktop ? 'q-page-color' : 'bg-mobile-login'"
  >
    <div
      v-if="$q.platform.is.mobile"
      style="
        background-color: rgba(128, 96, 82, 0.5);
        height: 100vh;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 2;
      "
    ></div>
    <div style="width: 100%; max-width: 740px" class="row full-height">
      <div style="max-width: 300px; width: 100%" v-if="$q.platform.is.desktop">
        <q-img style="width: 100%" src="../../public/img/login.png"></q-img>
      </div>
      <div
        class="col relative-position"
        :style="
          $q.platform.is.desktop
            ? 'background-color: #020305; border-radius: 0px 20px 20px 0px'
            : 'padding:10px;z-index:3'
        "
      >
        <div align="center" class="text-white q-pt-xl q-pb-lg">
          <span class="font-36"> SMART BHMS </span>
          <br />
          <span class="font-18"> Bridge Health Monitor System </span>
        </div>
        <div class="q-px-xl text-white">
          <q-input
            style="max-width: 300px; margin: auto"
            autofocus
            standout="bg-blue-grey-9"
            bg-color="white"
            placeholder="Enter your username"
            label="Username"
            v-model="username"
            dense
          ></q-input>

          <div class="q-pt-md">
            <q-input
              style="max-width: 300px; margin: auto"
              standout="bg-blue-grey-9"
              bg-color="white"
              label="Password"
              placeholder="Enter your password"
              v-model="password"
              dense
            ></q-input>
          </div>
        </div>

        <div class="q-pt-lg" align="center">
          <q-btn
            dense
            label="Login"
            style="width: 200px"
            class="font-16 text-white"
            color="teal"
            @click="login()"
          ></q-btn>
        </div>
        <div class="text-white font-14 absolute-bottom q-pb-sm" align="center">
          TSPK Inspection & Consultant Co.,ltd
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import axios from "axios";
export default {
  setup() {
    const username = ref("");
    const password = ref("");

    const router = useRouter;
    const $q = useQuasar;

    const login = async () => {
      console.log("login clicked");
      const url = "http://localhost:5000/bhms-5e304/us-central1/bhms/login";

      const postData = {
        username: username.value,
        password: password.value,
      };

      let res = await axios.post(url, postData);
      const token = res.data;

      firebase
        .auth()
        .signInWithCustomToken(token)
        .then(function (response) {
          console.log("signed in");
        })
        .catch(function (error) {
          console.log(error);
        });

      // db.collection("CESD_Accounts")
      //   .where("username", "==", username.value)
      //   .where("password", "==", password.value)
      //   .get()
      //   .then((doc) => {
      //     if (doc.size) {
      //     }
      //   });
    };

    return { username, password, login };
  },
};
</script>

<style lang="scss" scoped>
.bg-mobile-login {
  background-image: url("../../public/img/login-mobile.png");
  background-position: center;
  background-size: cover;
}
</style>

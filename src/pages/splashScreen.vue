<template>
  <q-layout
    view="lHh lpr lFf"
    container
    style="height: 100vh"
    class="shadow-2 rounded-borders bg-splash"
  >
    <div class="">
      <!-- Header -->
      <q-header class="bg-drop">
        <div class="q-pa-lg flex flex-center">
          <div class="q-px-md" align="right">
            <q-img
              style="width: 100%; width: 80px"
              src="../../public/img/logo1.png"
            ></q-img>
          </div>
          <div
            class=""
            align="center"
            :style="
              $q.platform.is.desktop
                ? 'font-size: 4vh'
                : 'font-size:2.5vh;padding-top:20px'
            "
          >
            Bridge health monitoring system
          </div>
        </div>
      </q-header>
      <!-- Header -->
      <q-footer elevated style="background-color: #202541">
        <q-toolbar
          style="background-color: #202541"
          class="flex flex-center"
          :class="$q.platform.is.desktop ? 'q-py-lg' : 'q-pb-sm'"
        >
          <div class="">
            <div class="flex-center flex">
              <div :class="{ 'q-pt-sm': $q.platform.is.mobile }" align="center">
                <q-img
                  style="width: 100%; width: 70px"
                  src="../../public/img/logo.png"
                ></q-img>
              </div>
              <div class="q-pl-md" align="left">
                <div
                  class="text-white"
                  :class="{
                    'font-30': $q.platform.is.desktop,
                    'f1-mobile': $q.platform.is.mobile,
                  }"
                >
                  Developed by
                </div>
                <div
                  class="text-white q-py-sm"
                  :class="{ 'font-18': $q.platform.is.desktop }"
                >
                  Center of excellence in structural dynamics and urban management
                </div>
                <div class="text-white" :class="{ 'font-18': $q.platform.is.desktop }">
                  King Mongkut’s University of Technology North Bangkok
                </div>
              </div>
            </div>
          </div>
        </q-toolbar>
      </q-footer>
    </div>
  </q-layout>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar, QSpinnerFacebook } from "quasar";

export default {
  setup() {
    //   ROUTER
    const router = useRouter();
    // Loading Bar
    const bar = ref(null);
    // Quasar
    const $q = useQuasar();

    onMounted(() => {
      //   trigger();
      setTimeout(() => {
        $q.loading.show({
          spinner: QSpinnerFacebook,
        });
        setTimeout(() => {
          $q.loading.hide();
          router.push("/project");
        }, 1000);
      }, 2000);
    });
  },
};
</script>

<style lang="scss" scoped>
.bg-splash {
  background-image: url("../../public/img/splash-bg.jpg");
  background-size: cover;
}
.f1-mobile {
  font-size: 3vh;
}

.bg-drop {
  background-color: rgba(32, 37, 65, 0.2);
}

.ajax-color {
  background-image: linear-gradient(to right, #de88f3, #a317c6);
}
</style>

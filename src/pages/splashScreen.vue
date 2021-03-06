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
          class="row items-center q-px-md q-py-lg"
        >
          <div class="col-12">
            <div class="row justify-center items-center">
              <div class="col-xs-2 col-1" align="center">
                <q-img
                  style="width: 100%; max-width: 70px"
                  src="../../public/img/logo.png"
                ></q-img>
              </div>
              <div class="col-xs-10 col-5 q-pl-md" align="left">
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

  <!-- <div style="height: calc(100vh - 200px)" class="bg-splash"></div> -->

  <!-- Footer -->
  <!-- <div
    style="min-height: 200px; background-color: #202541"
    class="row items-center q-pa-md"
  >
    <div align="center" class="q-py-lg col-12">
      <div class="row justify-center items-center">
        <div class="col-md-2 col-xs-12">
          <q-img style="width: 100px" src="../../public/img/logo.png"></q-img>
        </div>
        <div class="col-md-10" align="left">
          <div class="text-white" style="font-size: 24px">Developed by</div>
          <p class="text-white" style="font-size: 16px">
            Center of excellence in structural dynamics and urban management
          </p>
          <p class="text-white" style="font-size: 16px">
            King Mongkut’s University of Technology North Bangkok
          </p>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
export default {};
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
</style>

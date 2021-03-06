<template>
  <q-page class="q-page-color">
    <!-- Header Toolbar -->
    <q-toolbar>
      <span style="font-size: 2vh" class="text-white">
        Project : การซ่อมแซมตอม่อ ทล. 9
      </span>
      <q-space></q-space>
      <div class="q-pl-sm">
        <q-btn
          icon="fas fa-info"
          size="sm"
          flat
          round
          class="text-white bg-blue-main"
        ></q-btn>
      </div>
    </q-toolbar>
    <div class="q-px-md">
      <q-separator color="white" />
    </div>

    <!-- Content -->

    <div class="relative-position" align="center" style="height: calc(100vh - 60px)">
      <q-img
        style="max-width: 1000px; width: 80%"
        src="../../public/img/overall-1.png"
        class="absolute-center"
      ></q-img>
    </div>
  </q-page>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>

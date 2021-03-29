<template>
  <q-page class="q-page-color" style="overflow: hidden">
    <!-- Header -->
    <div class="row items-center q-px-md q-pt-md q-col-gutter-md">
      <span style="font-size: 2vh" class="text-white">Settings</span>
      <div class="q-px-md">
        <q-radio
          v-model="mode"
          label="BHMS Box"
          color="white"
          keep-color=""
          :val="1"
          class="text-white"
        ></q-radio>
        <q-radio
          v-model="mode"
          label="Notification"
          color="white"
          keep-color=""
          :val="2"
          class="text-white"
        ></q-radio>
      </div>
      <q-space />
      <div class="q-gutter-sm">
        <q-btn
          label="Add BHMS Box"
          color="teal"
          class="text-white q-px-sm"
          no-caps
        ></q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <q-separator color="white" />
    </div>
    <!-- Header -->
    <!-- TABLE -->
    <div class="q-pa-md">
      <table>
        <tr class="bg-white">
          <td style="width: 130px">Box Code</td>
          <td>Sensor</td>
          <td>Limit</td>
          <td style="width: 130px">Status</td>
        </tr>
      </table>
    </div>

    <!-- Add BHMS BOX Dialog -->

    <q-dialog v-model="isShowAddBhmsBoxDialog">
      <q-card style="width: 360px" class="transparent">
        <q-card-section class="no-padding">
          <div
            align="center"
            class="text-white q-py-sm"
            style="font-size: 24px; background-color: #2a3155"
          >
            Add BHMS Box
          </div>
        </q-card-section>
        <q-card-section class="no-padding q-pa-md" style="background-color: #4d5688">
          <q-form class="q-px-lg q-py-md">
            <div class="row text-white items-end">
              <div>Box code</div>
              <div class="col q-pl-md">
                <q-input v-model="box.code" dense dark></q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions> </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const mode = ref(1);
    const isShowAddBhmsBoxDialog = ref(true);
    const box = ref({
      code: "",
      startDate: "",
      sensor: [],
    });
    return { mode, isShowAddBhmsBoxDialog, box };
  },
};
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
td {
  text-align: center;
  padding: 8px;
}
</style>

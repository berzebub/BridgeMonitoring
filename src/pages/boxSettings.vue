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
          @click="isShowAddBhmsBoxDialog = true"
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
        <tr v-for="(item, index) in dataList" :key="index" class="text-white">
          <td style="width: 100px">
            <span v-if="index == 0">
              {{ item.boxCode }}
              <q-btn @click="settingSensor(item)" icon="fas fa-edit" flat></q-btn>
            </span>
            <span v-else-if="index != 0 && dataList[index - 1].boxCode != item.boxCode">
              {{ item.boxCode }}
              <q-btn @click="settingSensor(item)" icon="fas fa-edit" flat></q-btn>
            </span>
          </td>
          <td>
            <div align="center">
              {{ showSensorName(item.sensor) }} ({{ item.sensor }})
              <q-btn @click="settingLimitation(item)" icon="fas fa-edit" flat></q-btn>
            </div>
          </td>

          <td>xxx</td>
          <td>
            {{ item.status }}
          </td>
        </tr>
      </table>
    </div>

    <!-- Add BHMS BOX Dialog -->

    <q-dialog v-model="isShowAddBhmsBoxDialog" persistent>
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
        <q-form class="" @submit="addSensor()">
          <q-card-section class="" style="background-color: #4d5688">
            <div class="row text-white items-end">
              <div>Box code</div>
              <div class="col q-pl-md">
                <q-input
                  :rules="[(val) => !!val || 'Please Enter Box Code']"
                  hide-bottom-space
                  v-model="box.code"
                  dense
                  dark
                ></q-input>
              </div>
            </div>

            <div class="row text-white items-end">
              <div>Start Date</div>
              <div class="q-pl-md col">
                <q-input
                  @click="isShowStartDateCalendar = true"
                  dark
                  dense
                  color="grey-3"
                  label-color="orange"
                  v-model="startDate"
                  style="width: 100%"
                >
                  <template v-slot:append>
                    <q-icon name="event" color="orange" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row text-white items-end" v-for="i in 8">
              <div>Sensor #{{ i }}</div>
              <div class="col q-pl-md">
                <q-select
                  v-model="box.sensor[i - 1]"
                  dense
                  dark
                  :options="sensorOptions"
                ></q-select>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center" style="background-color: #4d5688">
            <q-btn
              style="width: 120px; text-decoration: underline"
              label="Cancel"
              flat
              v-close-popup
              text-color="white"
              no-caps
            >
            </q-btn>
            <q-btn
              type="submit"
              style="width: 120px"
              label="Add"
              color="teal"
              no-caps
            ></q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isShowStartDateCalendar">
      <q-card
        align="center"
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section align="center">
          <div class="q-gutter-md row items-start justify-center">
            <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm" color="indigo" dark />
            <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm" color="indigo" dark />
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            label="Cancel"
            v-close-popup
            no-caps
            flat
            style="text-decoration: underline"
          ></q-btn>
          <q-btn
            label="Apply"
            v-close-popup
            color="white"
            text-color="black"
            no-caps
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { db } from "src/router";
import { useQuasar } from "quasar";
export default {
  setup() {
    const mode = ref(1);
    const isShowAddBhmsBoxDialog = ref(false);
    const box = ref({
      code: "",
      startDate: "",
      sensor: [],
    });
    const $q = useQuasar();
    const sensorOptions = [
      "Accelerometer",
      "Tilt sensor",
      "Displacement sensor",
      "Strain sensor",
    ];

    // Add BHMS BOX
    const addSensor = async () => {
      const filteredData = [...new Set(box.value.sensor.filter((x) => x))];
      $q.loading.show();

      let counter = 0;

      const checkName = await db
        .collection("CESD_Configs")
        .where("boxCode", "==", box.value.code)
        .get();

      if (checkName.size) {
        console.log("DUP");
        $q.notify({
          message: "Box Code นี้มีอยู่แล้วในระบบ",
          color: "red",
        });
        $q.loading.hide();
        return;
      }

      for (let i = 0; i < filteredData.length; i++) {
        const countData = box.value.sensor.filter((x) => x == filteredData[i]).length;

        for (let j = 0; j < countData; j++) {
          let sensorName;
          if (filteredData[i] == "Accelerometer") {
            sensorName = `AC0${j + 1}`;
          } else if (filteredData[i] == "Tilt sensor") {
            sensorName = `TM0${j + 1}`;
          } else if (filteredData[i] == "Displacement sensor") {
            sensorName = `TM0${j + 1}`;
          } else if (filteredData[i] == "Strain sensor") {
            sensorName = `SG0${j + 1}`;
          }

          db.collection("CESD_Configs")
            .add({
              sensor: sensorName,
              boxCode: box.value.code,
              startDate: startDate.value,
              createdDate: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              counter++;
              if (counter == filteredData.length) {
                $q.loading.hide();
                isShowAddBhmsBoxDialog.value = false;
                $q.notify({
                  message: "เพิ่มข้อมูลสำเร็จ",
                  color: "teal",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    };
    const isShowStartDateCalendar = ref(false);
    const startDate = ref("");

    // Load Box Configs
    const dataList = ref([]);
    const loadBoxConfigs = async () => {
      let dataConfigs = await db.collection("CESD_Configs").get();
      let temp = [];
      dataConfigs.forEach((element) => {
        temp.push({ ...element.data(), id: element.id });
      });
      temp = temp.sort((a, b) => {
        return a.boxCode > b.boxCode ? 1 : -1;
      });

      dataList.value = temp;
    };

    // Show Full sensor name
    const showSensorName = (value) => {
      if (value.startsWith("AC")) {
        return "Accelerometer";
      } else if (value.startsWith("TM")) {
        return "Tilt Meter";
      } else if (value.startsWith("LV")) {
        return "Displacement Sensor";
      } else if (value.startsWith("SG")) {
        return "Strain Sensor";
      }
    };

    // Setting Sensor
    const settingSensor = (item) => {};

    // Setting Sensor Limitation
    const settingLimitation = (item) => {};

    onMounted(() => {
      loadBoxConfigs();
    });
    return {
      mode,
      isShowAddBhmsBoxDialog,
      box,
      sensorOptions,
      addSensor,
      isShowStartDateCalendar,
      startDate,
      dataList,
      showSensorName,
      settingLimitation,
      settingSensor,
    };
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

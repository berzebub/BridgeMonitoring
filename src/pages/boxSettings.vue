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
          @click="(isShowAddBhmsBoxDialog = true), (isEditSensorMode = false)"
        ></q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <q-separator color="white" />
    </div>
    <!-- Header -->
    <!-- TABLE -->
    <div class="q-pa-md" v-if="mode == 1">
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

          <td>
            <!-- ACC LIMIT -->
            <span v-if="item.sensor.startsWith('AC')">
              {{ item.xLimit || "-" }} m/s² <span class="q-px-sm">|</span>
              {{ item.yLimit || "-" }} m/s² <span class="q-px-sm">|</span>
              {{ item.zLimit || "-" }} m/s²
            </span>
            <!-- SG LIMIT -->
            <span v-if="item.sensor.startsWith('SG')"> {{ item.limit || "-" }} µε </span>

            <!-- TILT LIMIT -->
            <span v-if="item.sensor.startsWith('TM')">
              {{ item.xLimit || "-" }} mrad <span class="q-px-sm">|</span>
              {{ item.yLimit || "-" }} mrad
            </span>

            <!-- LV LIMIT -->
            <span v-if="item.sensor.startsWith('LV')"> {{ item.limit || "-" }} mm </span>
          </td>
          <td>
            <div class="flex flex-center">
              <div
                style="
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background-color: #36bd7c;
                "
              ></div>
              <div class="q-pl-sm">Connect</div>
            </div>
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
            <span v-if="isEditSensorMode"> Edit </span>
            <span v-else> Add </span>
            BHMS Box
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
                  clearable
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

    <!-- Calendar -->
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

    <!-- Acceleromenter limit setting dialog -->
    <q-dialog v-model="isShowAccLimitSettings" persistent>
      <q-card
        align="center"
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section class="no-padding">
          <div
            align="center"
            class="text-white q-py-sm"
            style="font-size: 24px; background-color: #2a3155"
          >
            Accelerometer Limit ({{ tempActiveData.sensor }})
          </div>
        </q-card-section>
        <q-card-section class="no-padding">
          <div style="background-color: #4d5688" class="q-pa-md">
            <!-- X-limit -->
            <div class="row items-end justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: red;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">x - limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="accLimit.x"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> m/s² </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Y-limit -->
            <div class="row items-end q-py-sm justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: blue;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">y - limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="accLimit.y"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> m/s² </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Z-limit -->
            <div class="row items-end justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: teal;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">z - limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="accLimit.z"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> m/s² </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" style="background-color: #4d5688">
          <q-btn style="width: 80px" v-close-popup flat label="Cancel" no-caps></q-btn>
          <q-btn
            style="width: 80px"
            class="bg-teal"
            label="Save"
            @click="saveAccLimitConfig()"
            no-caps
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Tilt Sensor Limit Setting Dialog -->
    <q-dialog v-model="isShowTiltLimitSettings" persistent>
      <q-card
        align="center"
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section class="no-padding">
          <div
            align="center"
            class="text-white q-py-sm"
            style="font-size: 24px; background-color: #2a3155"
          >
            Tilt Sensor Limit ({{ tempActiveData.sensor }})
          </div>
        </q-card-section>
        <q-card-section class="no-padding">
          <div style="background-color: #4d5688" class="q-pa-md">
            <!-- X-limit -->
            <div class="row items-end justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: red;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">x - limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="tiltLimit.x"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> mrad </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Y-limit -->
            <div class="row items-end q-py-sm justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: blue;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">y - limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="tiltLimit.y"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> mrad </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" style="background-color: #4d5688">
          <q-btn style="width: 80px" v-close-popup flat label="Cancel" no-caps></q-btn>
          <q-btn
            style="width: 80px"
            class="bg-teal"
            label="Save"
            @click="saveTiltLimitConfig()"
            no-caps
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Displacement Sensor Limit Setting Dialog -->
    <q-dialog v-model="isShowDisplacementLimitSettings" persistent>
      <q-card
        align="center"
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section class="no-padding">
          <div
            align="center"
            class="text-white q-py-sm"
            style="font-size: 24px; background-color: #2a3155"
          >
            Displacement Limit ({{ tempActiveData.sensor }})
          </div>
        </q-card-section>
        <q-card-section class="no-padding">
          <div style="background-color: #4d5688" class="q-pa-md">
            <!-- -limit -->
            <div class="row items-end justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: red;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="displacementLimit.limit"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> mm </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" style="background-color: #4d5688">
          <q-btn style="width: 80px" v-close-popup flat label="Cancel" no-caps></q-btn>
          <q-btn
            style="width: 80px"
            class="bg-teal"
            label="Save"
            @click="saveDisplacementLimit()"
            no-caps
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Strain Sensor Limit Setting Dialog -->
    <q-dialog v-model="isShowStrainLimitSettings" persistent>
      <q-card
        align="center"
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section class="no-padding">
          <div
            align="center"
            class="text-white q-py-sm"
            style="font-size: 24px; background-color: #2a3155"
          >
            Strain Limit ({{ tempActiveData.sensor }})
          </div>
        </q-card-section>
        <q-card-section class="no-padding">
          <div style="background-color: #4d5688" class="q-pa-md">
            <!-- -limit -->
            <div class="row items-end justify-around">
              <div class="col-5 flex flex-start items-center">
                <div
                  style="
                    width: 15px;
                    height: 15px;
                    background-color: red;
                    border: 1px solid white;
                  "
                ></div>
                <div class="q-pl-sm" style="font-size: 18px">limit</div>
              </div>
              <div class="col-5">
                <div>
                  <q-input
                    type="number"
                    color="orange"
                    dense
                    dark
                    v-model.number="strainLimit.limit"
                  >
                    <template v-slot:append>
                      <span style="font-size: 18px; color: white"> mm </span>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" style="background-color: #4d5688">
          <q-btn style="width: 80px" v-close-popup flat label="Cancel" no-caps></q-btn>
          <q-btn
            style="width: 80px"
            class="bg-teal"
            label="Save"
            @click="saveStrainLimit()"
            no-caps
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
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
      $q.loading.show();

      if (isEditSensorMode.value) {
        // กรณี เป็น Edit Mode ทำการลบข้อมูลก่อนแล้ว add เข้าไปใหม่
        let getData = await db
          .collection("CESD_Configs")
          .where("boxCode", "==", box.value.code)
          .get();

        for (const element of getData.docs) {
          await db.collection("CESD_Configs").doc(element.id).delete();
        }
      }
      let counter = 0;
      const filteredData = [...new Set(box.value.sensor.filter((x) => x))];

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
            sensorName = `LV0${j + 1}`;
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
    // Display Dialog Calendar
    const isShowStartDateCalendar = ref(false);
    // Start Date
    const startDate = ref("");

    // Load Box Configs
    const dataList = ref([]);
    const loadBoxConfigs = db.collection("CESD_Configs").onSnapshot((data) => {
      let temp = [];
      data.forEach((element) => {
        temp.push({ ...element.data(), id: element.id });
      });
      temp = temp.sort((a, b) => {
        return a.boxCode > b.boxCode ? 1 : -1;
      });

      dataList.value = temp;
    });

    // Show Full sensor name
    const showSensorName = (value) => {
      if (value.startsWith("AC")) {
        return "Accelerometer";
      } else if (value.startsWith("TM")) {
        return "Tilt Meter";
      } else if (value.startsWith("LV")) {
        return "Displacement sensor";
      } else if (value.startsWith("SG")) {
        return "Strain Sensor";
      }
    };

    // Display Dialog
    const isShowAccLimitSettings = ref(false);
    const isShowTiltLimitSettings = ref(false);
    const isShowDisplacementLimitSettings = ref(false);
    const isShowStrainLimitSettings = ref(false);

    // Acc Limit Config
    const accLimit = ref({
      x: 0,
      y: 0,
      z: 0,
    });

    // Save Acc Limit Config
    const saveAccLimitConfig = () => {
      db.collection("CESD_Configs")
        .doc(tempActiveData.value.id)
        .update({
          xLimit: accLimit.value.x,
          yLimit: accLimit.value.y,
          zLimit: accLimit.value.z,
        })
        .then(() => {
          $q.notify({
            message: "บันทึกสำเร็จ",
            color: "teal",
          });
          isShowAccLimitSettings.value = false;
        });
    };

    // Tilt Limit Config
    const tiltLimit = ref({
      x: 0,
      y: 0,
    });

    const saveTiltLimitConfig = () => {
      db.collection("CESD_Configs")
        .doc(tempActiveData.value.id)
        .update({
          xLimit: tiltLimit.value.x,
          yLimit: tiltLimit.value.y,
        })
        .then(() => {
          $q.notify({
            message: "บันทึกสำเร็จ",
            color: "teal",
          });
          isShowTiltLimitSettings.value = false;
        });
    };

    // Displacement Limit Config
    const displacementLimit = ref({
      limit: 0,
    });

    const saveDisplacementLimit = () => {
      db.collection("CESD_Configs")
        .doc(tempActiveData.value.id)
        .update({
          limit: displacementLimit.value.limit,
        })
        .then(() => {
          $q.notify({
            message: "บันทึกสำเร็จ",
            color: "teal",
          });
          isShowDisplacementLimitSettings.value = false;
        });
    };

    // Strain Limit Config
    const strainLimit = ref({
      limit: 0,
    });
    const saveStrainLimit = () => {
      console.log("save strain");
      db.collection("CESD_Configs")
        .doc(tempActiveData.value.id)
        .update({
          limit: strainLimit.value.limit,
        })
        .then(() => {
          $q.notify({
            message: "บันทึกสำเร็จ",
            color: "teal",
          });
          isShowStrainLimitSettings.value = false;
        });
    };

    const isEditSensorMode = ref(false);
    // Setting Sensor
    const settingSensor = (item) => {
      isEditSensorMode.value = true;
      const filterData = dataList.value.filter((x) => x.boxCode == item.boxCode);
      const mapSensor = filterData.map((x) => {
        if (x.sensor.startsWith("AC")) {
          return "Accelerometer";
        } else if (x.sensor.startsWith("TM")) {
          return "Tilt Meter";
        } else if (x.sensor.startsWith("LV")) {
          return "Displacement sensor";
        } else if (x.sensor.startsWith("SG")) {
          return "Strain sensor";
        }
      });
      box.value.sensor = mapSensor;
      box.value.code = item.boxCode;
      startDate.value = item.startDate;
      isShowAddBhmsBoxDialog.value = true;
    };

    const tempActiveData = ref("");
    // Setting Sensor Limitation
    const settingLimitation = (item) => {
      tempActiveData.value = item;
      if (item.sensor.startsWith("AC")) {
        accLimit.value.x = item.xLimit || 0;
        accLimit.value.y = item.yLimit || 0;
        accLimit.value.z = item.zLimit || 0;
        isShowAccLimitSettings.value = true;
      } else if (item.sensor.startsWith("TM")) {
        tiltLimit.value.x = item.xLimit || 0;
        tiltLimit.value.y = item.yLimit || 0;
        isShowTiltLimitSettings.value = true;
      } else if (item.sensor.startsWith("LV")) {
        displacementLimit.value.limit = item.limit || 0;
        isShowDisplacementLimitSettings.value = true;
      } else if (item.sensor.startsWith("SG")) {
        console.log(item);
        strainLimit.value.limit = item.limit || 0;
        isShowStrainLimitSettings.value = true;
      }
    };

    onBeforeUnmount(() => {
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
      isShowAccLimitSettings,
      isShowTiltLimitSettings,
      isShowDisplacementLimitSettings,
      isShowStrainLimitSettings,
      accLimit,
      tiltLimit,
      displacementLimit,
      strainLimit,
      tempActiveData,
      saveTiltLimitConfig,
      saveAccLimitConfig,
      saveDisplacementLimit,
      saveStrainLimit,
      isEditSensorMode,
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

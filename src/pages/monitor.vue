<template>
  <q-page class="q-page-color" style="overflow: hidden">
    <!-- Header Toolbar -->
    <div class="row items-center q-px-md q-pt-md q-col-gutter-md">
      <span style="font-size: 2vh" class="text-white">Monitor</span>
      <div class="q-px-md">
        <q-select
          dark
          :options="monitorOptions"
          map-options
          emit-value
          v-model="monitorSelected"
          @update:model-value="findSensor()"
          dense
          standout
        ></q-select>
      </div>
      <q-space />
      <div class="q-gutter-sm row">
        <q-select
          dark
          :options="sensorList"
          map-options
          emit-value
          v-model="sensorSelected"
          dense
          standout
          @update:model-value="loadRanderGraph()"
        >
        </q-select>
        <q-btn
          v-if="isLoadedData"
          dense
          :label="`Updated in ${graphData[0].convertedDate}`"
          outline
          class="text-white q-px-sm no-pointer-events"
          no-caps
        ></q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <q-separator color="white" />
    </div>
    <!-- END HEADER TOOLBAR -->

    <!-- MENU 1 AC Content -->
    <q-card
      class="transparent q-px-md"
      v-show="activeMenu == 'AC' || activeMenu == 'OA'"
      :class="{ 'q-pt-lg': activeMenu == 'OA' }"
    >
      <q-card-section class="no-padding">
        <div
          class="row"
          :class="{ 'q-pb-lg': $q.platform.is.desktop }"
          v-for="(item, index) in ACList"
          v-show="
            (activeMenu == 'OA' || (activeMenu == 'AC' && sensorActive == item)) &&
            !acGraphToHide.includes('containerAC-' + item)
          "
        >
          <!-- ด้านซ้าย -->
          <div class="col-md self-start col-xs-12">
            <div class="row q-pb-md">
              <div>
                <div class="text-white" style="font-size: 2vh">
                  AC0{{ item }} - Accelerator
                </div>
              </div>

              <div class="col q-pr-xs" align="right" v-if="activeMenu == 'AC'">
                <q-btn
                  class="bg-white"
                  size="lg"
                  round
                  icon="fas fa-file-medical-alt"
                ></q-btn>
              </div>
            </div>
            <div class="row" v-if="activeMenu == 'AC'">
              <div class="col">
                <q-btn
                  @click="settings(1)"
                  class="bg-white fit q-py-md"
                  label="Duration : 24 hours"
                  no-caps
                  dense
                ></q-btn>
              </div>
              <div class="col-1" style="width: 5px"></div>
              <div class="col-3">
                <q-btn
                  v-if="overXAc + overYAc + overZAc > 0"
                  class="bg-white fit q-py-sm"
                  no-caps
                  @click="showExceedData(1)"
                  dense
                >
                  <q-icon
                    class="q-mx-sm text-red q-pa-sm"
                    name="fas fa-exclamation-circle"
                  ></q-icon>
                  <span>
                    <span class=""> Excess limit </span>
                    ({{ overXAc + overYAc + overZAc }})
                  </span>
                </q-btn>

                <q-btn class="bg-white fit q-py-sm" v-else>
                  <q-icon
                    class="q-mx-sm text-green q-pa-sm"
                    name="fas fa-check-circle"
                  ></q-icon
                  >No exceed limit
                </q-btn>
              </div>
            </div>
            <!-- GRAPH 1  -->
            <div :id="`container-${item}`" class="fit q-mt-sm"></div>
          </div>

          <div class="col-md-1" style="width: 30px"></div>
          <!-- ด้านขวา -->
          <div
            class="col-md-4 col-xs-12"
            :class="activeMenu == 'OA' ? 'self-center' : 'self-start'"
          >
            <div class="text-white" align="center" v-if="activeMenu == 'OA'">
              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #82a86a"></div>
                </div>
                <div class="q-pl-md">ACC-X เกิน Limit {{ overXAc }} ครั้ง</div>
              </div>

              <div class="flex flex-center q-py-sm">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #3c4dae"></div>
                </div>
                <div class="q-pl-md">ACC-Y เกิน Limit {{ overYAc }} ครั้ง</div>
              </div>

              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #ff0000"></div>
                </div>
                <div class="q-pl-md">ACC-Z เกิน Limit {{ overZAc }} ครั้ง</div>
              </div>
            </div>

            <div v-if="activeMenu == 'AC'" class>
              <q-table
                :pagination="initialPagination"
                :rows="graphData"
                :columns="colsAc01"
                row-key="name"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="convertedDate" :props="props">{{
                      props.row.convertedDate
                    }}</q-td>
                    <q-td key="AC01_x" :props="props">{{
                      props.row.AC01_x.toFixed(2)
                    }}</q-td>
                    <q-td key="AC01_y" :props="props">{{
                      props.row.AC01_y.toFixed(2)
                    }}</q-td>
                    <q-td key="AC01_z" :props="props">{{
                      props.row.AC01_z.toFixed(2)
                    }}</q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- MENU 2 TM Content -->
    <q-card
      class="transparent q-px-md"
      v-show="activeMenu == 'TM' || activeMenu == 'OA'"
      :class="{ 'q-pt-lg': activeMenu == 'OA' }"
    >
      <q-card-section class="no-padding">
        <div
          class="row"
          :class="{ 'q-pb-lg': $q.platform.is.desktop }"
          v-for="(item, index) in TMList"
          v-show="
            (activeMenu == 'OA' || (activeMenu == 'TM' && sensorActive == item)) &&
            !tmGraphToHide.includes('containerTM-' + item)
          "
        >
          <div class="col-md col-xs-12">
            <div class="row q-pb-md">
              <div class="col">
                <div class="text-white q-pb-sm" style="font-size: 2vh">
                  TM0{{ item }} - Tilt Meter
                </div>
              </div>
              <div class="col q-pr-xs" align="right" v-if="activeMenu == 'TM'">
                <q-btn
                  class="bg-white"
                  size="lg"
                  round
                  icon="fas fa-file-medical-alt"
                ></q-btn>
              </div>
              <div></div>
            </div>
            <div class="row" v-if="activeMenu == 'TM'">
              <div class="col">
                <q-btn
                  @click="settings(2)"
                  class="bg-white fit q-py-md"
                  label="25/12/2563 6:00  --->  26/12/2563  6:00"
                  no-caps
                ></q-btn>
              </div>
              <div class="col-1" style="width: 5px"></div>
              <div class="col-3">
                <q-btn
                  v-if="overXTm + overYTm > 0"
                  class="bg-white fit q-py-sm"
                  no-caps
                  @click="showExceedData(2)"
                >
                  <q-icon
                    class="q-mx-sm text-red q-pa-sm"
                    name="fas fa-exclamation-circle"
                  ></q-icon>
                  <span> Excess limit ({{ overXTm + overYTm }}) </span>
                </q-btn>

                <q-btn v-else class="bg-white fit q-py-sm" no-caps>
                  <q-icon
                    class="q-mx-sm text-green q-pa-sm"
                    name="fas fa-check-circle"
                  ></q-icon>
                  <span>No exceed limit</span>
                </q-btn>
              </div>
            </div>

            <!-- GRAPH TM  -->
            <div :id="`containerTM-${item}`" class="fit q-mt-sm"></div>
          </div>

          <div class="col-md-1" style="width: 30px"></div>

          <div
            class="col-md-4 col-xs-12 text-white"
            :class="activeMenu == 'OA' ? 'self-center' : 'self-start'"
          >
            <div class="q-pa-sm" align="center" v-if="activeMenu == 'OA'">
              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #82a86a"></div>
                </div>
                <div class="q-pl-md">TILT-X เกิน Limit {{ overXTm }} ครั้ง</div>
              </div>

              <div class="flex flex-center q-py-md">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #3c4dae"></div>
                </div>
                <div class="q-pl-md">TILT-Y เกิน Limit {{ overYTm }} ครั้ง</div>
              </div>
            </div>

            <div v-if="activeMenu == 'TM'" class>
              <q-table
                :pagination="initialPagination"
                :rows="graphData"
                :columns="colsTm01"
                row-key="name"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="convertedDate" :props="props">{{
                      props.row.convertedDate
                    }}</q-td>
                    <q-td key="max_TM01_x" :props="props">{{
                      props.row.max_TM01_x.toFixed(2)
                    }}</q-td>
                    <q-td key="max_TM01_y" :props="props">{{
                      props.row.max_TM01_y.toFixed(2)
                    }}</q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- MENU 3 SG Content -->
    <q-card
      class="transparent q-px-md"
      v-show="activeMenu == 'SG' || activeMenu == 'OA'"
      :class="{ 'q-pt-lg': activeMenu == 'OA' }"
    >
      <q-card-section class="no-padding">
        <div
          class="row"
          :class="{ 'q-pb-lg': $q.platform.is.desktop }"
          v-for="(item, index) in SGList"
          v-show="
            (activeMenu == 'OA' || (activeMenu == 'SG' && sensorActive == item)) &&
            !sgGraphToHide.includes(`containerSG-${item}`)
          "
        >
          <div class="col-md col-xs-12">
            <div class="row q-pb-md">
              <div class="col">
                <div class="text-white q-pb-sm" style="font-size: 2vh">
                  SG0{{ item }} - Strain sensor
                </div>
              </div>
              <div class="col q-pr-xs" align="right" v-if="activeMenu == 'SG'">
                <q-btn
                  class="bg-white"
                  size="lg"
                  round
                  icon="fas fa-file-medical-alt"
                ></q-btn>
              </div>
              <div></div>
            </div>
            <div class="row" v-if="activeMenu == 'SG'">
              <div class="col">
                <q-btn
                  @click="settings(3)"
                  class="bg-white fit q-py-md"
                  label="25/12/2563 6:00  --->  26/12/2563  6:00"
                  no-caps
                ></q-btn>
              </div>
              <div class="col-1" style="width: 5px"></div>
              <div class="col-3">
                <q-btn
                  v-if="overStrain1 + overStrain2 + overStrain3 > 0"
                  class="bg-white fit q-py-sm"
                  no-caps
                  @click="showExceedData(3)"
                >
                  <q-icon
                    class="q-mx-sm text-red q-pa-sm"
                    name="fas fa-exclamation-circle"
                  ></q-icon>
                  <span>
                    Excess limit ({{ overStrain1 + overStrain2 + overStrain3 }})
                  </span>
                </q-btn>
                <q-btn v-else class="bg-white fit q-py-sm" no-caps>
                  <q-icon
                    class="q-mx-sm text-green q-pa-sm"
                    name="fas fa-check-circle"
                  ></q-icon>
                  <span>No exceed limit</span>
                </q-btn>
              </div>
            </div>

            <!-- GRAPH SG  -->
            <div :id="`containerSG-${item}`" class="fit q-mt-sm"></div>
          </div>

          <div class="col-md-1" style="width: 30px"></div>

          <div
            class="col-md-4 col-xs-12 text-white"
            :class="activeMenu == 'OA' ? 'self-center' : 'self-start'"
          >
            <div class="q-pa-sm" align="center" v-if="activeMenu == 'OA'">
              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #82a86a"></div>
                </div>
                <div class="q-pl-md" align="left" style="width: 170px">
                  Strain1 เกิน Limit {{ overStrain1 }} ครั้ง
                </div>
              </div>
              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #3c4dae"></div>
                </div>
                <div class="q-pl-md" align="left" style="width: 170px">
                  Strain2 เกิน Limit {{ overStrain2 }} ครั้ง
                </div>
              </div>
              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #ff0000"></div>
                </div>
                <div class="q-pl-md" align="left" style="width: 170px">
                  Strain3 เกิน Limit {{ overStrain3 }} ครั้ง
                </div>
              </div>
            </div>

            <div v-if="activeMenu == 'SG'">
              <q-table
                :pagination="initialPagination"
                :rows="graphData"
                :columns="colsSG"
                row-key="name"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="convertedDate" :props="props">{{
                      props.row.convertedDate
                    }}</q-td>
                    <q-td key="max_SG01" :props="props">{{
                      props.row.max_SG01.toFixed(2)
                    }}</q-td>
                    <q-td key="max_SG02" :props="props">{{
                      props.row.max_SG02.toFixed(2)
                    }}</q-td>
                    <q-td key="max_SG03" :props="props">{{
                      props.row.max_SG03.toFixed(2)
                    }}</q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="isShowExceedData">
      <q-card
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section>
          <div align="center" style="font-size: 24px">{{ activeExceedDataLabel }}</div>

          <table style="width: 100%; border-collapse: collapse">
            <tr>
              <td class="q-pa-sm">Date</td>
              <td class="q-pa-sm">Type</td>
              <td class="q-pa-sm">Value</td>
            </tr>
            <tr
              v-for="(item, index) in exceedData"
              :key="index"
              :style="index % 2 == 0 ? 'background-color:#202A65' : null"
            >
              <td class="q-pa-sm">{{ item.convertedDate }}</td>
              <td class="q-pa-sm">
                <div v-if="activeMenu == 'AC'">
                  <!-- AC -->
                  <span v-if="item.AC01_x > acLimitationX">Acc-x</span>
                  <span v-if="item.AC01_y > acLimitationY">Acc-y</span>
                  <span v-if="item.AC01_z > acLimitationZ">Acc-z</span>
                </div>
                <div v-else-if="activeMenu == 'TM'">
                  <!-- TM -->
                  <span v-if="item.max_TM01_x > tmLimitationX">Tilt-X</span>
                  <span v-if="item.max_TM01_y > tmLimitationY">Tilt-Y</span>
                </div>
                <div v-else-if="activeMenu == 'SG'">
                  <!-- SG -->
                  <span v-if="item.max_SG01 > sgLimitation1">SG01</span>
                  <span v-else-if="item.max_SG02 > sgLimitation2">SG02</span>
                  <span v-else-if="item.max_SG03 > sgLimitation3">SG03</span>
                </div>
              </td>
              <td class="q-pa-sm">
                <div v-if="activeMenu == 'AC'">
                  <!-- AC -->
                  <span v-if="item.AC01_x > acLimitationX">{{
                    item.AC01_x.toFixed(2)
                  }}</span>
                  <span v-if="item.AC01_y > acLimitationY">{{
                    item.AC01_y.toFixed(2)
                  }}</span>
                  <span v-if="item.AC01_z > acLimitationZ">{{
                    item.AC01_z.toFixed(2)
                  }}</span>
                </div>

                <div v-else-if="activeMenu == 'TM'">
                  <!-- TM -->
                  <span v-if="item.max_TM01_x > tmLimitationX">{{
                    item.max_TM01_x.toFixed(2)
                  }}</span>
                  <span v-if="item.max_TM01_y > tmLimitationY">{{
                    item.max_TM01_y.toFixed(2)
                  }}</span>
                </div>
                <div v-else-if="activeMenu == 'SG'">
                  <!-- TM -->
                  <span v-if="item.max_SG01 > sgLimitation1">{{
                    item.max_SG01.toFixed(2)
                  }}</span>
                  <span v-else-if="item.max_SG02 > sgLimitation2">{{
                    item.max_SG02.toFixed(2)
                  }}</span>
                  <span v-else-if="item.max_SG03 > sgLimitation3">{{
                    item.max_SG03.toFixed(2)
                  }}</span>
                </div>
              </td>
            </tr>
          </table>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-md">
          <q-btn
            v-close-popup
            color="white"
            text-color="black"
            style="width: 50%"
            label="Close"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isShowSettingDialog">
      <q-card
        style="background-color: #202541; color: white; max-width: 600px; width: 100%"
      >
        <q-card-section>
          <div style="font-size: 24px" align="center">Set Display Time Interval</div>

          <div class="flex">
            <div style="width: 150px">
              <q-radio
                color="white"
                keep-color
                v-model="radioSelected"
                val="1"
                label="Current time"
              ></q-radio>
            </div>
          </div>

          <div class="flex items-center">
            <div style="width: 40px"></div>
            Duration
            <div class="q-pl-md">
              <q-select
                dense
                dark
                filled
                :options="['24 Hours', '48 Hours', '72 Hours']"
                v-model="durationSelected"
              ></q-select>
            </div>
          </div>

          <div class="q-py-md">
            <q-separator color="white" />
          </div>

          <div class="flex">
            <div style="width: 150px">
              <q-radio
                color="white"
                keep-color
                v-model="radioSelected"
                val="2"
                label="Specific time"
              ></q-radio>
            </div>
          </div>

          <!-- Start Date // Start Time -->
          <div class="row">
            <div class="col-12">
              <div class="row items-center q-pa-sm">
                <div class="col-3">Start Date</div>
                <div class="col-9">
                  <q-input
                    :disable="radioSelected == '1'"
                    @click="showStartDateCalendar()"
                    filled
                    dark
                    dense
                    color="grey-3"
                    label-color="orange"
                    outlined
                    v-model="startDate"
                  >
                    <template v-slot:append>
                      <q-icon name="event" color="orange" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>

          <!-- End Date // End Time -->
          <div class="row">
            <div class="col-12">
              <div class="row items-center q-pa-sm">
                <div class="col-3">End Date</div>
                <div class="col-9">
                  <q-input
                    :disable="radioSelected == '1'"
                    @click="isShowEndDateCalendar = true"
                    filled
                    dark
                    dense
                    color="grey-3"
                    label-color="orange"
                    outlined
                    v-model="endDate"
                  >
                    <template v-slot:append>
                      <q-icon name="event" color="orange" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
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
          <q-btn label="Apply" color="white" text-color="black" no-caps></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Calendar Start Date -->
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

    <!-- Calendar End Date -->
    <q-dialog v-model="isShowEndDateCalendar">
      <q-card
        align="center"
        style="background-color: #202541; color: white; max-width: 360px; width: 100%"
      >
        <q-card-section align="center">
          <div class="q-gutter-md row items-start justify-center">
            <q-date v-model="endDate" mask="YYYY-MM-DD HH:mm" color="indigo" dark />
            <q-time v-model="endDate" mask="YYYY-MM-DD HH:mm" color="indigo" dark />
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
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { db } from "src/router";
const Highcharts = require("highcharts");
export default {
  setup() {
    const isShowExceedData = ref(false);
    const activeExceedDataLabel = ref("");
    const exceedData = ref([]);
    const showExceedData = (menu) => {
      exceedData.value = [];
      if (menu == 1) {
        activeExceedDataLabel.value = "AC01 - Exceed limit";
        let findOverLimitationData = graphData.value.filter(
          (x) =>
            x.AC01_x > acLimitationX.value ||
            x.AC01_y > acLimitationY.value ||
            x.AC01_z > acLimitationZ.value
        );
        exceedData.value = findOverLimitationData;
      } else if (menu == 2) {
        activeExceedDataLabel.value = "TM01 - Exceed limit";

        let findOverLimitationData = graphData.value.filter(
          (x) => x.max_TM01_x > tmLimitationX.value || x.max_TM01_y > tmLimitationY.value
        );
        exceedData.value = findOverLimitationData;
      } else if (menu == 3) {
        activeExceedDataLabel.value = "SG - Exceed limit";

        let findOverLimitationData = graphData.value.filter(
          (x) =>
            x.max_SG01 > sgLimitation1.value ||
            x.max_SG02 > sgLimitation2.value ||
            x.max_SG03 > sgLimitation3.value
        );
        exceedData.value = findOverLimitationData;
      }
      isShowExceedData.value = true;
    };
    // AC-01
    const colsAc01 = ref([
      {
        name: "convertedDate",
        required: true,
        field: "convertedDate",
        label: "Date",
        align: "left",
        sortable: true,
      },
      {
        name: "AC01_x",
        align: "center",
        field: "AC01_x",
        label: "Acc-x",
        sortable: true,
      },
      {
        name: "AC01_y",
        align: "center",
        field: "AC01_y",
        label: "Acc-y",
        sortable: true,
      },
      {
        name: "AC01_z",
        align: "center",
        field: "AC01_z",
        label: "Acc-z",
        sortable: true,
      },
    ]);

    const initialPagination = ref({
      page: 1,
      rowsPerPage: 15,
      // rowsNumber: xx if getting data from a server
    });

    // TM-01
    const colsTm01 = ref([
      {
        name: "convertedDate",
        required: true,
        field: "convertedDate",
        label: "Date",
        align: "left",
        sortable: true,
      },
      {
        name: "max_TM01_x",
        align: "center",
        field: "max_TM01_x",
        label: "Tilt-X",
        sortable: true,
      },
      {
        name: "max_TM01_y",
        align: "center",
        field: "max_TM01_y",
        label: "Tilt-Y",
        sortable: true,
      },
    ]);

    // TM-01
    const colsSG = ref([
      {
        name: "convertedDate",
        required: true,
        field: "convertedDate",
        label: "Date",
        align: "left",
        sortable: true,
      },
      {
        name: "max_SG01",
        align: "center",
        field: "max_SG01",
        label: "Strain1",
        sortable: true,
      },
      {
        name: "max_SG02",
        align: "center",
        field: "max_SG02",
        label: "Strain2",
        sortable: true,
      },
      {
        name: "max_SG03",
        align: "center",
        field: "max_SG03",
        label: "Strain3",
        sortable: true,
      },
    ]);

    // Quasar
    const $q = useQuasar();

    // Monitor
    const monitorSelected = ref("");
    const monitorOptions = ref([]);
    const monitorList = ref([]);
    const sensorList = ref([]);
    const sensorSelected = ref("OA");
    const collectionName = ref("");

    const loadMonitor = async () => {
      let getData = await db.collection("CESD_Configs").get();

      let temp = [];
      let tempList = [];

      getData.forEach((res) => {
        let newData = { id: res.id, ...res.data() };

        tempList.push(newData);
        temp.push(res.data().boxCode);
      });

      temp = [...new Set(temp)];

      temp = temp.map((x, index) => {
        let newData = { value: x, label: x };

        return newData;
      });

      monitorOptions.value = temp;
      monitorSelected.value = temp[0].value;

      monitorList.value = tempList;
      // console.log(monitorSelected.value);
      collectionName.value = monitorSelected.value;

      findSensor();

      snapshot();
    };

    // Selected Sensor
    const activeMenu = ref("OA");

    const findSensor = () => {
      let newDataList = [
        {
          value: "OA",
          label: "OverAll",
        },
      ];

      if (monitorList.value.length) {
        let findData = monitorList.value
          .filter((x) => x.boxCode == monitorSelected.value)
          .sort((a, b) => (a.sensor > b.sensor ? 1 : -1))
          .map((x) => {
            let newData = {
              value: x.sensor,
              label: x.sensor,
            };

            return newData;
          });

        newDataList.push(...findData);

        sensorList.value = newDataList;

        sensorSelected.value = newDataList[0].value;
      } else {
        sensorList.value = [];
      }
    };

    const changeMenu = (menu) => {
      activeMenu.value = menu;
    };

    // const overLimit

    const overXAc = ref(0);
    const overYAc = ref(0);
    const overZAc = ref(0);
    const exceedAc01 = ref([]);

    const acLimitationX = ref(0);
    const acLimitationY = ref(0);
    const acLimitationZ = ref(0);
    const acSettings = ref("");

    const ACList = ref([1, 2, 3, 4, 5, 6, 7, 8]);
    const sensorActive = ref("");

    const loadRanderGraph = () => {
      activeMenu.value = sensorSelected.value.substring(0, 2);
      sensorActive.value = sensorSelected.value.substring(3);

      randerGraphAC();
      randerGraphTM();
      randerGraphSG();
    };

    // *********************************** GRAPH AC ***********************************
    const acGraphToHide = ref([]);
    const randerGraphAC = () => {
      const tickInterval = Math.floor(graphData.value.length / 5);

      for (let i = 0; i < ACList.value.length; i++) {
        let newSensorX = "AC0" + ACList.value[i] + "_x";
        let newSensorY = "AC0" + ACList.value[i] + "_y";
        let newSensorZ = "AC0" + ACList.value[i] + "_z";

        let getLimitation = monitorList.value.filter(
          (x) => x.sensor == `AC0` + ACList.value[i]
        );

        if (getLimitation.length) {
          acLimitationX.value = getLimitation[0].xLimit;
          acLimitationY.value = getLimitation[0].yLimit;
          acLimitationZ.value = getLimitation[0].zLimit;
        }

        let dataAccX = graphData.value
          .map((x) => {
            return {
              name: x.convertedDate,
              y: x[newSensorX],
              timestamp: x.createdTime.seconds,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);

        const checkDataExists = dataAccX.filter((x) => x.y).length;

        overXAc.value = dataAccX.filter((x) => x.y > acLimitationX.value).length;

        let dataAccY = graphData.value
          .map((x) => {
            return {
              name: x.convertedDate,
              y: x[newSensorY],
              timestamp: x.createdTime.seconds,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);

        overYAc.value = dataAccY.filter((x) => x.y > acLimitationY.value).length;

        let dataAccZ = graphData.value
          .map((x) => {
            return {
              name: x.convertedDate,
              y: x[newSensorZ],
              timestamp: x.createdTime.seconds,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);
        overZAc.value = dataAccZ.filter((x) => x.y > acLimitationZ.value).length;

        if (checkDataExists) {
          Highcharts.chart({
            chart: {
              renderTo: "container-" + ACList.value[i],
              type: "spline",
              height: $q.platform.is.desktop ? "40%" : "100%", // 16:9 ratio
            },
            title: {
              align: "left",
              useHTML: true,
              text:
                "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
            },

            xAxis: {
              type: "category",
              tickInterval: tickInterval,
              tickWidth: 1,
              gridLineWidth: 1,
            },
            yAxis: {
              plotLines: [
                {
                  color: "green", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: acLimitationX.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "AC01_X limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
                {
                  color: "blue", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: acLimitationY.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "AC01_Y limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
                {
                  color: "red", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: acLimitationZ.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "AC01_Z limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
              ],
              title: {
                text: "Temperature",
                enabled: false,
              },
              labels: {
                formatter: function () {
                  return this.value;
                },
              },
            },
            tooltip: {
              crosshairs: true,
              shared: true,
            },
            plotOptions: {
              spline: {
                marker: {
                  enabled: false,
                },
              },
            },

            series: [
              {
                name: "ACC-X",
                data: dataAccX,
                color: "green",
                showInLegend: true,
              },
              {
                name: "ACC-Y",
                data: dataAccY,
                color: "blue",
                showInLegend: true,
              },
              {
                name: "ACC-Z",
                data: dataAccZ,
                color: "red",
                showInLegend: true,
              },
            ],
          });
        } else {
          let containerName = "containerAC-" + ACList.value[i];
          acGraphToHide.value.push(containerName);

          // console.log(containerName);
        }
      }
    };

    // *********************************** GRAPH TM ***********************************
    const overXTm = ref(0);
    const overYTm = ref(0);
    const overZTm = ref(0);
    const tmLimitationX = ref(0);
    const tmLimitationY = ref(0);
    const tmSettings = ref("");

    const TMList = ref([1, 2, 3, 4, 5, 6, 7, 8]);

    const tmGraphToHide = ref([]);
    const randerGraphTM = () => {
      function randomValue() {
        return Math.random() * 1;
      }

      for (let i = 0; i < TMList.value.length; i++) {
        let newSensorX = "max_TM0" + TMList.value[i] + "_x";
        let newSensorY = "max_TM0" + TMList.value[i] + "_y";

        let getLimitation = monitorList.value.filter(
          (x) => x.sensor == `TM0` + ACList.value[i]
        );

        if (getLimitation.length) {
          tmLimitationX.value = getLimitation[0].xLimit;
          tmLimitationY.value = getLimitation[0].yLimit;
        }

        const tmX = graphData.value
          .map((x) => {
            return {
              name: x.convertedDate,
              y: x[newSensorX],
              timestamp: x.createdTime.seconds,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);

        overXTm.value = tmX.filter((x) => x.y > tmLimitationX.value).length;

        const tmY = graphData.value
          .map((x) => {
            return {
              name: x.convertedDate,
              y: x[newSensorY],
              timestamp: x.createdTime.seconds,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);
        overYTm.value = tmY.filter((x) => x.y > tmLimitationY.value).length;

        const checkDataExists = tmX.filter((x) => x.y).length;

        if (checkDataExists) {
          Highcharts.chart({
            chart: {
              renderTo: "containerTM-" + TMList.value[i],
              type: "spline",
              height: $q.platform.is.desktop ? "40%" : "100%", // 16:9 ratio
            },
            title: {
              align: "left",
              useHTML: true,
              text:
                "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
            },

            xAxis: {
              type: "category",
              tickInterval: Math.floor(graphData.value.length / 5),
              tickWidth: 1,
              gridLineWidth: 1,
            },
            yAxis: {
              plotLines: [
                {
                  color: "green", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: tmLimitationX.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "TM01_X limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
                {
                  color: "red", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: tmLimitationY.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "TM01_Y limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
              ],
              title: {
                text: "Temperature",
                enabled: false,
              },
              labels: {
                formatter: function () {
                  return this.value;
                },
              },
            },
            tooltip: {
              crosshairs: true,
              shared: true,
            },
            plotOptions: {
              spline: {
                marker: {
                  enabled: false,
                },
              },
            },

            series: [
              {
                name: "TILT-X",
                data: tmX,
                color: "green",
              },
              {
                name: "TILT-Y",
                data: tmY,
                color: "blue",
              },
            ],
          });
        } else {
          tmGraphToHide.value.push("containerTM-" + TMList.value[i]);
        }
      }
    };

    // *********************************** GRAPH SG ***********************************

    const overStrain1 = ref(0);
    const overStrain2 = ref(0);
    const overStrain3 = ref(0);
    const sgLimitation1 = ref(0.5);
    const sgLimitation2 = ref(0.4);
    const sgLimitation3 = ref(0.3);
    const sgSettings = ref("");

    const SGList = ref([1, 2, 3, 4, 5, 6, 7, 8]);

    const sgGraphToHide = ref([]);

    const randerGraphSG = () => {
      function randomValue() {
        return Math.random() * 1;
      }

      for (let i = 0; i < SGList.value.length; i++) {
        let newSensor = "max_SG0" + SGList.value[i];

        let dataStrain = graphData.value
          .map((x) => {
            return {
              name: x.convertedDate,
              y: x[newSensor],
              timestamp: x.createdTime.seconds,
            };
          })
          .sort((a, b) => a.timestamp - b.timestamp);

        overStrain1.value = dataStrain.filter((x) => x.y > sgLimitation1.value).length;

        const checkDataExists = dataStrain.filter((x) => x.y).length;

        console.log(checkDataExists);

        if (checkDataExists) {
          Highcharts.chart({
            chart: {
              randerTo: "containerSG-" + SGList.value[i],
              type: "spline",
              height: $q.platform.is.desktop ? "40%" : "100%", // 16:9 ratio
            },
            title: {
              align: "left",
              useHTML: true,
              text:
                "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
            },

            xAxis: {
              type: "category",
              tickInterval: Math.floor(graphData.value.length / 5),
              tickWidth: 1,
              gridLineWidth: 1,
            },
            yAxis: {
              plotLines: [
                {
                  color: "green", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: sgLimitation1.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "SG1 limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
                {
                  color: "blue", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: sgLimitation2.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "SG2 limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
                {
                  color: "red", // Color value
                  dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
                  value: sgLimitation3.value, // Value of where the line will appear
                  width: 2, // Width of the line
                  label: {
                    text: "SG3 limitation",
                    align: "right",
                    x: -20,
                    style: {
                      fontSize: "10px",
                    },
                  },
                },
              ],
              title: {
                text: "Temperature",
                enabled: false,
              },
              labels: {
                formatter: function () {
                  return this.value;
                },
              },
            },
            tooltip: {
              crosshairs: true,
              shared: true,
            },
            plotOptions: {
              spline: {
                marker: {
                  enabled: false,
                },
                //  pointInterval: 3600000, // one hour
                // pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
              },
            },
            series: [
              {
                name: "SG01",
                data: dataStrain,
                color: "green",
              },
            ],
          });
        } else {
          sgGraphToHide.value.push("containerSG-" + SGList.value[i]);
        }
      }
    };

    const graphData = ref([]);

    const isLoadedData = ref(false);

    const snapshot = () => {
      db.collection(collectionName.value).onSnapshot((doc) => {
        $q.loading.show();

        let currentTime = new Date().getTime();
        let timeBefore24Hrs = 24 * 3600 * 1000;

        let time24HrAgo = (currentTime - timeBefore24Hrs) / 1000;

        let temp = [];
        doc.forEach((element) => {
          if (element.data().createdTime.seconds > time24HrAgo) {
            //   console.log(element.data());
            // }
            // console.log(element.data().createdTime.seconds);
            let convertedDate = timeConverter(element.data().createdTime.seconds);

            temp.push({ ...element.data(), convertedDate: convertedDate });
          }
        });
        temp = temp.sort((a, b) => b.createdTime.seconds - a.createdTime.seconds);
        graphData.value = temp;
        isLoadedData.value = true;

        loadRanderGraph();
        $q.loading.hide();
      });
    };

    function timeConverter(UNIX_timestamp) {
      var a = new Date(UNIX_timestamp * 1000);
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var sec = a.getSeconds();
      var time =
        date +
        "/" +
        Number(a.getMonth() + 1) +
        "/" +
        year +
        " " +
        hour +
        ":" +
        min +
        ":" +
        sec;
      return time;
    }

    const isShowSettingDialog = ref(false);
    const radioSelected = ref("1");
    const durationSelected = ref("24 Hours");
    const settings = (menu) => {
      isShowSettingDialog.value = true;
    };

    const isShowStartDateCalendar = ref(false);
    const isShowEndDateCalendar = ref(false);

    const startDate = ref("");
    const showStartDateCalendar = () => {
      isShowStartDateCalendar.value = true;
    };

    const endDate = ref("");

    // Mounted
    onMounted(loadMonitor);

    return {
      isShowSettingDialog,
      isLoadedData,
      graphData,
      monitorOptions,
      monitorSelected,
      activeMenu,
      changeMenu,
      overXAc,
      overYAc,
      overZAc,
      overXTm,
      overYTm,
      overZTm,
      colsAc01,
      colsTm01,
      colsSG,
      initialPagination,
      timeConverter,
      overStrain1,
      overStrain2,
      overStrain3,
      isShowExceedData,
      activeExceedDataLabel,
      exceedData,
      showExceedData,
      acLimitationX,
      acLimitationY,
      acLimitationZ,
      tmLimitationX,
      tmLimitationY,
      sgLimitation1,
      sgLimitation2,
      sgLimitation3,
      acSettings,
      tmSettings,
      sgSettings,
      settings,
      radioSelected,
      durationSelected,
      showStartDateCalendar,
      isShowEndDateCalendar,
      isShowStartDateCalendar,
      startDate,
      endDate,
      sensorList,
      sensorSelected,
      findSensor,
      loadRanderGraph,
      ACList,
      TMList,
      SGList,
      sensorActive,
      acGraphToHide,
      tmGraphToHide,
      sgGraphToHide,
      collectionName,
      monitorList,
    };
  },
};
</script>

<style lang="scss" scoped>
.q-if-control {
  color: white !important;
}
.font-header-graph {
  font-size: 8px;
}
</style>

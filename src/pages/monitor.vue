<template>
  <q-page class="q-page-color">
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
          dense
          standout
        ></q-select>
      </div>
      <q-space />
      <div class="q-gutter-sm">
        <q-btn
          @click="changeMenu(0)"
          dense
          label="Overall"
          class="text-white q-px-sm"
          :class="activeMenu == 0 ? 'bg-teal' : 'bg-blue-main'"
          no-caps
        ></q-btn>
        <q-btn
          @click="changeMenu(1)"
          dense
          label="AC01"
          class="text-white q-px-sm"
          :class="activeMenu == 1 ? 'bg-teal' : 'bg-blue-main'"
          no-caps
        ></q-btn>
        <q-btn
          @click="changeMenu(2)"
          dense
          label="TM01"
          class="text-white q-px-sm"
          :class="activeMenu == 2 ? 'bg-teal' : 'bg-blue-main'"
          no-caps
        ></q-btn>
        <q-btn dense label="Update in 2:00" outline class="text-white q-px-sm" no-caps></q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <q-separator color="white" />
    </div>
    <!-- END HEADER TOOLBAR -->

    <!-- MENU 1 Content -->
    <q-card class="transparent" v-show="activeMenu == 1 || activeMenu == 0">
      <q-card-section class>
        <div class="row" :class="{ 'q-pb-lg': $q.platform.is.desktop }">
          <!-- ด้านซ้าย -->
          <div class="col-md self-start col-xs-12">
            <div class="row q-pb-md">
              <div>
                <div class="text-white" style="font-size: 2vh">AC01 - Accelerator</div>
              </div>

              <div class="col q-pr-xs" align="right" v-if="activeMenu == 1">
                <q-btn class="bg-white" size="lg" round icon="fas fa-file-medical-alt"></q-btn>
              </div>
            </div>
            <div class="row" v-if="activeMenu == 1">
              <div class="col">
                <q-btn class="bg-white fit q-py-md" label="Duration : 24 hours" no-caps></q-btn>
              </div>
              <div class="col-1" style="width: 5px"></div>
              <div class="col-3">
                <q-btn class="bg-white fit q-py-sm" no-caps>
                  <q-icon class="q-mx-sm text-red q-pa-sm" name="fas fa-exclamation-circle"></q-icon>
                  <span>Excess limit (6)</span>
                </q-btn>
              </div>
            </div>
            <!-- GRAPH 1  -->
            <div id="container" class="fit q-mt-sm q-mb-md"></div>
          </div>

          <div class="col-md-1" style="width: 30px"></div>
          <!-- ด้านขวา -->
          <div class="col-md-4 col-xs-12" :class="activeMenu == 0 ? 'self-center' : 'self-start'">
            <div class="text-white" align="center" v-if="activeMenu == 0">
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

            <div v-if="activeMenu == 1" class>
              <q-table
                square
                :rows="accelerometerData"
                :columns="colsAc01"
                row-key="name"
                :pagination="initialPagination"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- MENU 2 Content -->
    <q-card class="transparent q-px-md q-pt-md" v-show="activeMenu == 2 || activeMenu == 0">
      <q-card-section class="no-padding">
        <div class="row" :class="{ 'q-pb-lg': $q.platform.is.desktop }">
          <div class="col-md col-xs-12">
            <div class="row q-pb-md">
              <div class="col">
                <div class="text-white q-pb-sm" style="font-size: 2vh">TM01 - Tilt Meter</div>
              </div>
              <div class="col q-pr-xs" align="right" v-if="activeMenu == 2">
                <q-btn class="bg-white" size="lg" round icon="fas fa-file-medical-alt"></q-btn>
              </div>
              <div></div>
            </div>
            <div class="row" v-if="activeMenu == 2">
              <div class="col">
                <q-btn
                  class="bg-white fit q-py-md"
                  label="25/12/2563 6:00  --->  26/12/2563  6:00"
                  no-caps
                ></q-btn>
              </div>
              <div class="col-1" style="width: 5px"></div>
              <div class="col-3">
                <q-btn class="bg-white fit q-py-sm" no-caps>
                  <q-icon class="q-mx-sm text-red q-pa-sm" name="fas fa-exclamation-circle"></q-icon>
                  <span>Excess limit (6)</span>
                </q-btn>
              </div>
            </div>

            <!-- GRAPH TM  -->
            <div id="containerTM" class="bg-white fit q-mt-sm q-mb-md"></div>
          </div>

          <div class="col-md-1" style="width: 30px"></div>

          <div
            class="col-md-4 col-xs-12 text-white"
            :class="activeMenu == 0 ? 'self-center' : 'self-start'"
          >
            <div class="q-pa-sm" align="center" v-if="activeMenu == 0">
              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #82a86a"></div>
                </div>
                <div class="q-pl-md">ACC-X เกิน Limit {{ overXTm }} ครั้ง</div>
              </div>

              <div class="flex flex-center q-py-md">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #3c4dae"></div>
                </div>
                <div class="q-pl-md">ACC-Yเกิน Limit {{ overYTm }} ครั้ง</div>
              </div>

              <div class="flex flex-center">
                <div style="width: 80px">
                  <div style="width: 70px; height: 4px; background-color: #ff0000"></div>
                </div>
                <div class="q-pl-md">ACC-Z เกิน Limit {{ overZTm }} ครั้ง</div>
              </div>
            </div>

            <div v-if="activeMenu == 2" class>
              <q-table
                square
                :rows="rowsTm01"
                :columns="colsTm01"
                row-key="name"
                :pagination="initialPagination"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { db } from "src/router";
const Highcharts = require("highcharts");
export default {
  setup() {
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

    const rowsAc01 = ref([
      {
        date: "25/11/2563",
        accx: 159,
        accy: 6.0,
        accz: 24,
      },
      {
        date: "25/11/2563",
        accx: 159,
        accy: 6.0,
        accz: 24,
      },
    ]);

    const initialPagination = ref({
      page: 1,
      rowsPerPage: 20,
      // rowsNumber: xx if getting data from a server
    });

    // TM-01
    const colsTm01 = ref([
      {
        name: "date",
        required: true,
        field: "date",
        label: "Date",
        align: "left",
        sortable: true,
      },
      {
        name: "tiltx",
        align: "center",
        field: "tiltx",
        label: "Tilt-X",
        sortable: true,
      },
      {
        name: "tilty",
        align: "center",
        field: "tilty",
        label: "Tilt-Y",
        sortable: true,
      },
    ]);

    const rowsTm01 = ref([
      {
        date: "25/11/2563",
        tiltx: 6.0,
        tilty: 24,
      },
      {
        date: "25/11/2563",
        tiltx: 6.0,
        tilty: 24,
      },
    ]);

    // Quasar
    const $q = useQuasar();

    const monitorSelected = ref("1");
    const monitorOptions = ref([
      {
        value: "1",
        label: "A1-BHMS",
      },
      {
        value: "2",
        label: "T1-BHMS",
      },
    ]);

    const activeMenu = ref(0);
    const changeMenu = (menu) => {
      activeMenu.value = menu;
    };

    // const overLimit

    const overXAc = ref(0);
    const overYAc = ref(0);
    const overZAc = ref(0);
    // GRAPH AC
    const randerGraphAC = () => {
      const limitation = 0.5;
      function randomValue() {
        return Math.random() * 1;
      }


      const dataAccX = accelerometerData.value.map((x) => x.AC01_x);


      overXAc.value = dataAccX.filter((x) => x > limitation).length;

      const dataAccY = accelerometerData.value.map((x) => x.AC01_y);
      overYAc.value = dataAccY.filter((x) => x > limitation).length;

      const dataAccZ = accelerometerData.value.map((x) => x.AC01_z);
      overZAc.value = dataAccZ.filter((x) => x > limitation).length;

      Highcharts.chart("container", {
        chart: {
          type: "spline",
          height: $q.platform.is.desktop ? "40%" : "100%", // 16:9 ratio
        },
        title: {
          align: "left",
          useHTML: true,
          text:
            "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
        },

        // xAxis: {
        //   categories: ["6:00", "12:00", "18:00", "24:00", "6:00"],
        // },
        yAxis: {
          plotLines: [
            {
              color: "black", // Color value
              dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
              value: limitation, // Value of where the line will appear
              width: 2, // Width of the line
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
          },
          {
            name: "ACC-Y",
            data: dataAccY,
            color: "blue",
          },
          {
            name: "ACC-Z",
            data: dataAccZ,
            color: "red",
          },
        ],
      });
    };

    // GRAPH TM

    const overXTm = ref(0);
    const overYTm = ref(0);
    const overZTm = ref(0);
    const randerGraphTM = () => {
      function randomValue() {
        return Math.random() * 1;
      }
      const limitation = 0.8;

      const dataAccX = accelerometerData.value.map(x => x.max_TM01_x)

      overXTm.value = dataAccX.filter((x) => x > limitation).length;

      const dataAccY = accelerometerData.value.map(x => x.max_TM01_y)
      overYTm.value = dataAccY.filter((x) => x > limitation).length;

      const dataAccZ =accelerometerData.value.map(x => x.max_TM01_z)
      overZTm.value = dataAccZ.filter((x) => x > limitation).length;

      Highcharts.chart("containerTM", {
        chart: {
          type: "spline",
          height: $q.platform.is.desktop ? "40%" : "100%", // 16:9 ratio
        },
        title: {
          align: "left",
          useHTML: true,
          text:
            "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
        },

        // xAxis: {
        //   categories: ["6:00", "12:00", "18:00", "24:00", "6:00"],
        // },
        yAxis: {
          plotLines: [
            {
              color: "black", // Color value
              dashStyle: "LongDashDotDot", // Style of the plot line. Default to solid
              value: limitation, // Value of where the line will appear
              width: 2, // Width of the line
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
          },
          {
            name: "ACC-Y",
            data: dataAccY,
            color: "blue",
          },
          {
            name: "ACC-Z",
            data: dataAccZ,
            color: "red",
          },
        ],
      });
    };

    const accelerometerData = ref([]);

    const snapshot = db.collection("CESD").onSnapshot((doc) => {
      let temp = [];
      doc.forEach((element) => {
        let convertedDate = timeConverter(element.data().createdTime.seconds);
        temp.push({ ...element.data(), convertedDate: convertedDate });
      });
      temp = temp.sort((a, b) => b.createdTime.seconds - a.createdTime.seconds);
      accelerometerData.value = temp;

        randerGraphAC();
      randerGraphTM();  
    });

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

    // onMounted(() => {
          

    // });

    return {
      accelerometerData,
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
      rowsAc01,
      colsTm01,
      rowsTm01,
      initialPagination,
      timeConverter,
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

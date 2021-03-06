<template>
  <q-page class="q-page-color">
    <!-- Header Toolbar -->
    <div class="row items-center q-px-md q-pt-md q-col-gutter-md">
      <span style="font-size: 2vh" class="text-white"> Monitor </span>
      <div class="q-px-md">
        <q-select
          dark
          :options="monitorOptions"
          map-options
          emit-value
          v-model="monitorSelected"
          dense
          standout=""
        >
        </q-select>
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
        <q-btn
          dense
          label="Update in 2:00"
          outline
          class="text-white q-px-sm"
          no-caps
        ></q-btn>
      </div>
    </div>
    <div class="q-pa-md">
      <q-separator color="white" />
    </div>
    <!-- END HEADER TOOLBAR -->

    <!-- MENU 1 Content -->
    <q-card class="bg-transparent q-px-md" v-show="activeMenu == 1 || activeMenu == 0">
      <q-card-section class="no-padding">
        <div class="text-white q-pb-sm" style="font-size: 2vh">AC01 - Accelerator</div>
        <div class="row" :class="{ 'q-pb-lg': $q.platform.is.desktop }">
          <div class="col-md-7 col-xs-12">
            <!-- GRAPH 1  -->
            <div id="container" class="bg-white fit"></div>
          </div>
          <div class="col-md-5 self-center col-xs-12 text-white">
            <div class="q-pa-sm" align="center">
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
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- MENU 2 Content -->
    <q-card
      class="bg-transparent q-px-md q-pt-md"
      v-show="activeMenu == 2 || activeMenu == 0"
    >
      <q-card-section class="no-padding">
        <div class="text-white q-pb-sm" style="font-size: 2vh">TM01 - Tilt Meter</div>
        <div class="row" :class="{ 'q-pb-lg': $q.platform.is.desktop }">
          <div class="col-md-7 col-xs-12">
            <!-- GRAPH TM  -->
            <div id="containerTM" class="bg-white fit"></div>
          </div>
          <div class="col-md-5 self-center col-xs-12 text-white">
            <div class="q-pa-sm" align="center">
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
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
const Highcharts = require("highcharts");
export default {
  setup() {
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

      const dataAccX = [
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ];

      overXAc.value = dataAccX.filter((x) => x > limitation).length;

      const dataAccY = [
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ];
      overYAc.value = dataAccY.filter((x) => x > limitation).length;

      const dataAccZ = [
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ];
      overZAc.value = dataAccZ.filter((x) => x > limitation).length;

      Highcharts.chart("container", {
        chart: {
          type: "spline",
          height: $q.platform.is.desktop ? "35%" : "100%", // 16:9 ratio
        },
        title: {
          align: "left",
          useHTML: true,
          text:
            "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
        },
        subtitle: {
          text: "Source: WorldClimate.com",
        },
        xAxis: {
          categories: ["6:00", "12:00", "18:00", "24:00", "6:00"],
        },
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

      const dataAccX = [
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ];

      overXTm.value = dataAccX.filter((x) => x > limitation).length;

      const dataAccY = [
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ];
      overYTm.value = dataAccY.filter((x) => x > limitation).length;

      const dataAccZ = [
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
        randomValue(),
      ];
      overZTm.value = dataAccZ.filter((x) => x > limitation).length;

      Highcharts.chart("containerTM", {
        chart: {
          type: "spline",
          height: $q.platform.is.desktop ? "35%" : "100%", // 16:9 ratio
        },
        title: {
          align: "left",
          useHTML: true,
          text:
            "Accelerator (m/s)<span style='font-size:8px;position:absolute;top:-2px'>2</span>",
        },
        subtitle: {
          text: "Source: WorldClimate.com",
        },
        xAxis: {
          categories: ["6:00", "12:00", "18:00", "24:00", "6:00"],
        },
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

    onMounted(() => {
      randerGraphAC();
      randerGraphTM();
    });

    return {
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

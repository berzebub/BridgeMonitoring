<template>
  <div class="flex flex-center window-height">
    <q-btn label="add Data" @click="addData()"></q-btn>

    <q-btn label="getData" @click="getData()"></q-btn>
  </div>
</template>

<script>
import { db } from "src/router";
export default {
  setup() {
    const addData = () => {
      db.collection("test")
        .add({
          data: "test",
          timestamp: {
            seconds: 1616504479,
            nanoseconds: 686000000,
          },
        })
        .then(() => {
          console.log("finish");
        });
    };

    const getData = () => {
      db.collection("test")
        .get()
        .then((doc) => {
          doc.forEach((element) => {
            console.log(element.data().timestamp.toMillis());
          });
        });
    };
    return { addData, getData };
  },
};
</script>

<style lang="scss" scoped></style>

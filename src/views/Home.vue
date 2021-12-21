<template>
  <div class="home">
    <div>Home</div>
    <div>{{ data1 }}</div>
    <div>{{ data2 }}</div>
    <div>{{ data3 }}</div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import axios from "axios";

axios.defaults.validateStatus = ():boolean => {return true;};
const OK = 200;

export default defineComponent({
  data: function () {
    return {
      data1: null,
      data2: null,
      data3: null
    };
  },
  created: async function () {
    const body = {
      yolo: "swag"
    };

    const response = await axios.post(`${process.env.VUE_APP_BACKEND}/testing`, body);

    if (response.status === OK) {
      if (response.data) {
        this.data1 = response.data.sample1;
        this.data2 = response.data.sample2;
        this.data3 = response.data.sample3;
      } else {
        this.data1 = "";
        this.data2 = "";
        this.data3 = "";
      }
    } else {
      this.data1 = "";
      this.data2 = "";
      this.data3 = "";
    }
  },
  methods: {
    Sample: function () {
      alert("Sample");
    }
  }
});
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
}
</style>

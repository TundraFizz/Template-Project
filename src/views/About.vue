<template>
  <div class="about">
    <div>Hello {{ hello }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: function () {
    return {
      hello: "world"
    };
  },
  created: function () {
    this.hello = "world";
  },
  methods: {
    Sample: function () {
      alert("Sample");
    }
  }
});
</script>

<style scoped lang="scss">
.about {
  display: flex;
}
</style>

<template>
    <router-view></router-view>
</template>

<script>
import { p } from "../api/tools.js";
export default {
  mounted() {
    Meteor.userId()
      ? this.$router.push({ name: "Home" })
      : this.$router.push({ name: "Login" });
  }
};
</script>

<style>
</style>

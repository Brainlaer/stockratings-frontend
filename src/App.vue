<script setup lang="ts">
import { PrimeIcons } from '@primevue/core/api';
import Navbar from './components/Navbar.vue';

</script>

<template>
    <div class=" flex-col w-screen-99">
      <div>
        <Navbar />
      </div>
      <div>
        <RouterView />
      </div>
    </div>
</template>

<style scoped></style>

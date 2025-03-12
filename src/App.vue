<script setup lang="ts">
import { PrimeIcons } from '@primevue/core/api';
import { Toast } from 'primevue';
import Navbar from './components/Navbar.vue';

</script>

<template>
  <Toast />
    <div class=" flex-col w-screen-99">
      <div>
        <Navbar />
      </div>
      <div class="p-1">
        <RouterView />
      </div>
    </div>
</template>

<style scoped></style>

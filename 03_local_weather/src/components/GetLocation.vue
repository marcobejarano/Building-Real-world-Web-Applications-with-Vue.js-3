<template>
  <WeatherReport 
    v-if="coords && !geolocationBlockedByUser"
    :coords="coords"
  />
  <div v-if="geolocationBlockedByUser">
    User denied access
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import WeatherReport from './WeatherReport.vue';

type Geolocation = {
  latitude: number;
  longitude: number;
}

const coords: Ref<Geolocation | undefined> = ref();
const geolocationBlockedByUser: Ref<boolean> = ref(false);

const getGeolocation = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        coords.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        resolve();
      },
      error => {
        geolocationBlockedByUser.value = true;
        console.error(error.message);
        reject(error);
      }
    );
  });
};

onMounted(async () => {
  try {
    await getGeolocation();
  } catch (error) {
    console.error('Error during geolocation:', error.message);
  }
});
</script>

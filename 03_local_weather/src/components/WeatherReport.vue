<template>
  <div>
    <article
      v-if="data && data.current"
      class="max-w-md w-96 rounded-lg shadow-lg p-4 flex bg-white text-black"
    >
      <div class="basis-1/4 text-left">
        <img :src="data.current.condition.icon" class="h-16 w-16" />
      </div>
      <div class="basis-3/4 text-left">
        <h1 class="text-3xl font-bold">
          {{ data.current.condition.text }}
          <span class="text-2xl block">{{ data.current.temp_c }}&#8451;</span>
        </h1>
        <p>{{ data.location.name }} {{ data.location.region }}</p>
        <p>Precipitation: {{ data.current.precip_mm }}mm</p>
        <p data-testid="localtime">{{ formatDate(data.location.localtime) }}</p>
        <p>
          Wind: {{ data.current.wind_kph }} kph
          <WindDirection :degrees="data.current.wind_degree" />
        </p>
      </div>
    </article>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import WindDirection from './WindDirection.vue';

type WeatherData = {
  location: {
    localtime: Date;
    name: string;
    region: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    precip_mm: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_degree: number;
    wind_kph: number;
    wind_mph: number;
  };
};

type Coords = {
  latitude: number;
  longitude: number;
}

interface Props {
  coords: Coords;
}

const props = defineProps<Props>();

const data: Ref<WeatherData | undefined> = ref();

const fetchWeather = async (coords: Coords): Promise<WeatherData> => {
  const { latitude, longitude } = coords;
  const q = `${latitude},${longitude}`;
  
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?` +
      `key=${import.meta.env.VITE_APP_WEATHER_API_KEY}&` +
      `q=${q}`
    );

    if (!res) {
      throw new Error('No response from weather API');
    }

    if (!res.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const apiData = await res.json();
    const data: WeatherData = {
      location: {
        localtime: apiData.location.localtime,
        name: apiData.location.name,
        region: apiData.location.region,
      },
      current: {
        temp_c: apiData.current.temp_c,
        temp_f: apiData.current.temp_f,
        precip_mm: apiData.current.precip_mm,
        condition: {
          text: apiData.current.condition.text,
          icon: apiData.current.condition.icon,
        },
        wind_degree: apiData.current.wind_degree,
        wind_kph: apiData.current.wind_kph,
        wind_mph: apiData.current.wind_mph,
      },
    };

    return data;
  } catch (error) {
    // Handle any errors here
    console.error('Error fetching weather data:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};

const formatDate = (dateString: Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date);
}

onMounted(async () => {
  const weatherResponse = await fetchWeather(props.coords);
  data.value = weatherResponse;
});
</script>

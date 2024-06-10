<template>
  <div>
    <LoadingIndicator v-if="isLoading" text="Loading comics..." />
    <div v-if="data && !isLoading">
      <div class="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ComicCard
          v-for="comic in data"
          :key="comic.id"
          :comic="comic"
        />
      </div>
      <Pagination
        :total-pages="totalPages"
        :current-page="+currentPage"
        path="/"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useComics } from '@/composables/marvelApi';
import type { Comic } from '@/types/marvel';
import LoadingIndicator from './LoadingIndicator.vue';
import ComicCard from './ComicCard.vue';
import Pagination from './Pagination.vue';

const route = useRoute();
const router = useRouter();

const isLoading: Ref<boolean> = ref(false);
const data: Ref<Comic[] | undefined> = ref();
const currentPage: Ref<number | string> = ref(0);
const totalPages: Ref<number> = ref(0);

if (route.params.page) {
  currentPage.value = +route.params.page;
}

const getComics = async (page: number = 0) => {
  try {
    isLoading.value = true;
    const comics = await useComics(page);

    currentPage.value = comics?.offset / comics?.limit || 0;
    totalPages.value = Math.ceil(comics.total / comics.limit);

    data.value = comics && comics.results;
    isLoading.value = false;
  } catch (error) {
    router.push({ path: 'error', query: { info: error as string }})
  }
};

watch(
  () => route.params.page,
  async (newPage) => {
    try {
      await getComics(+newPage);
    } catch (error) {
      console.error('Failed to fetch comics:', error);
    }
  }
);

onMounted(async () => {
  try {
    await getComics(+currentPage.value);
  } catch (error) {
    console.error('An error occurred while mounting the component:', error);
  }
});
</script>

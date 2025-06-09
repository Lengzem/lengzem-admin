<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Slider from '@/components/RandomMovieSlider.vue'

// Define the structure of a movie and category
interface Movie {
  id: number;
  title: string;
  cover_img: string;
  poster: string;
  description: string;
  genre: string[];
}

interface Category {
  title: string;
  movies: Movie[];
}

const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Fetch movies and group by category
onMounted(async () => {
  try {
    const response = await axios.get('https://apis.zostream.in/api/movies', {
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_KEY,
      },
      params: {
        age_restriction: false,
      },
    });

    // Map API response to categories
    categories.value = Object.entries(response.data).map(([title, movies]) => ({
      title: title.replace(/(^|\s)\S/g, (l) => l.toUpperCase()), // Capitalize each word
      movies: (movies as Movie[]).map(movie => ({
        ...movie,
        genre: Array.isArray(movie.genre) ? movie.genre : movie.genre.split(', '),
      })),
    }));
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Head title="Home" />

  <AppLayout>
    <div class="movies-section w-full">
      <div class="w-full">
      <Slider category="latest update" range="1-3" />
    </div>

      <!-- Show loader while fetching data -->
      <div v-if="loading" class="text-center my-10">
        <span class="text-gray-600 dark:text-gray-300">Loading categories...</span>
      </div>

      <!-- Show error message if any -->
      <div v-else-if="error" class="text-center text-red-600 dark:text-red-400 my-10">
        {{ error }}
      </div>

      <!-- Render categories once data is available -->
      <template v-else>
        <MovieList
          v-for="category in categories"
          :key="category.title"
          :title="category.title"
          :movies="category.movies"
        />
      </template>
    </div>
  </AppLayout>
</template>

<style scoped>
.movies-section {
  padding: 1rem;
}
</style>

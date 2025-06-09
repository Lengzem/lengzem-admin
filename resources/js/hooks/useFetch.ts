import { ref } from 'vue';

export function useFetch(url: string, options: RequestInit = {}) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const fetchData = async () => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      data.value = await response.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return { data, error, loading };
}

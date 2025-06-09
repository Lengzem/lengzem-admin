import { ref } from 'vue'
import axios from 'axios'

const pricing = ref(null)

const fetchPricing = async (plan, devices) => {
  try {
    const response = await axios.get(route('proxy.get'), {
      params: {
        endpoint: 'price',
        plan, // e.g., 'Thla 1'
        device: devices // e.g., 'Browser, Mobile, TV'
      }
    })

    if (response.data?.status === 'success') {
      pricing.value = response.data.data
    } else {
      pricing.value = null
      console.error('Unexpected pricing response:', response.data)
    }
  } catch (error) {
    console.error('Error fetching pricing:', error)
    pricing.value = null
  }
}

export default function usePricing() {
  return {
    pricing,
    fetchPricing
  }
}

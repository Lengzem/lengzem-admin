<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm, router } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/InputError.vue';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { Head } from '@inertiajs/vue3';
import { useProfileEditModal } from '@/composables/useProfileEditModal';

const toast = useToast();
const show = ref(true);
const { closeEditPro } = useProfileEditModal();

const firebaseUid = ref('');
const firebaseToken = ref('');
const form = useForm({
  call: '',
  img: '',
  khua: '',
  name: '',
  veng: '',
  dob: '',
});
const loading = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        firebaseUid.value = user.uid;
        firebaseToken.value = await user.getIdToken();
        await prefillUserData();
      } catch (error) {
        toast.error('Authentication error. Please try again.');
        console.error('Auth state error:', error);
      }
    } else {
      toast.error('Please login to continue.');
      router.visit('/login');
    }
  });
});

// Prefill user data
async function prefillUserData() {
  if (!firebaseUid.value || !firebaseToken.value) {
    toast.error('Authentication required');
    return;
  }

  try {
    loading.value = true;
    const res = await axios.get(route('proxy.get'), {
      params: {
        endpoint: 'user',
        uid: firebaseUid.value,
      },
    });

    // Validate response exists
    if (!res.data) {
      throw new Error('I data kan dawng lo');
    }

    // Handle the direct response structure (no nested 'data' property)
    const userData = res.data;
    
    // Update form with all available fields
    form.call = userData.call || '';
    form.khua = userData.khua || '';
    form.name = userData.name || '';
    form.veng = userData.veng || '';
    form.dob = userData.dob || '';
    form.img = userData.img || '';

  } catch (error: any) {
    console.error('User data fetch error:', error);
    toast.error(error.message || 'I data a load thei lo, ti tha rawh');
  } finally {
    loading.value = false;
  }
}

// Ensure phone input is string if vue-tel-input emits object
watch(() => form.call, (val) => {
  if (typeof val === 'object' && val !== null && 'number' in val) {
    form.call = val.number || '';
  }
});

function getFormattedDateTime() {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return now.toLocaleString('en-US', options).replace(',', '');
}

const submit = async () => {
  if (!firebaseUid.value || !firebaseToken.value) {
    toast.error('Unable to detect Firebase user. Try logging in again.');
    return;
  }

  try {
    await axios.post(
      route('proxy.post'),
      {
        call: form.call,
        img: form.img,
        khua: form.khua,
        name: form.name,
        veng: form.veng,
        uid: firebaseUid.value,
        isAccountComplete: true,
        edit_date: getFormattedDateTime(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          endpoint: 'update-profile',
        },
      }
    );

    toast.success('Profile update a ni e!');
    closeEditPro(); // Add this line to close the form
  } catch (error: any) {
    toast.error('Update a kal dik lo. Ti tha leh rawh.');
    console.error('Profile update error:', error);
  }
};
</script>

<template>
  <Head title="Profile Edit" />

  <div v-if="show" class="relative z-10 max-w-2xl w-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl backdrop-blur-md">
    <h2 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Edit Profile</h2>

    <form @submit.prevent="submit" class="space-y-6">
      <!-- Name -->
      <div class="space-y-1">
        <Label for="name" class="font-semibold text-gray-700 dark:text-gray-300">Name</Label>
        <Input id="name" v-model="form.name" type="text" placeholder="Enter your full name" class="w-full" />
        <InputError :message="form.errors.name" />
      </div>

      <!-- Phone -->
      <div class="space-y-1">
        <Label for="call" class="font-semibold">Phone</Label>
        <vue-tel-input v-model="form.call" mode="international" :validCharactersOnly="true"
          placeholder="Phone number"
          class="w-full dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400" />
        <InputError :message="form.errors.call" />
      </div>

      <!-- Khua -->
      <div class="space-y-1">
        <Label for="khua" class="font-semibold text-gray-700 dark:text-gray-300">Khua</Label>
        <Input id="khua" v-model="form.khua" type="text" placeholder="Your Khua" class="w-full" />
        <InputError :message="form.errors.khua" />
      </div>

      <!-- Veng -->
      <div class="space-y-1">
        <Label for="veng" class="font-semibold text-gray-700 dark:text-gray-300">Veng</Label>
        <Input id="veng" v-model="form.veng" type="text" placeholder="Your Veng" class="w-full" />
        <InputError :message="form.errors.veng" />
      </div>

      <!-- Submit Button -->
      <button @click="closeEditPro" class="mt-6 w-full text-center py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600">
        Close
      </button>
      <div>
        <Button type="submit"
          class="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg transition"
          :disabled="form.processing">
          Update Profile
        </Button>
      </div>
    </form>
  </div>

  <!-- Loading Overlay -->
  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <dotlottie-player src="https://lottie.host/1cbfa9df-7c2c-42c9-a861-f59ca88127f8/OrEOfu2zUL.lottie"
      background="transparent" speed="1" style="width: 100px; height: 100px" loop autoplay></dotlottie-player>
  </div>
</template>

<style scoped>
@keyframes gradientBlur {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradientBlur {
  animation: gradientBlur 15s ease infinite;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/InputError.vue';
import axios from 'axios';

const toast = useToast();

// 1. Define Props and Emits
const props = defineProps({
  isVisible: { type: Boolean, default: false },
  userId: { type: String, default: null }
});

const emit = defineEmits(['close', 'saved']);

const form = useForm({
  phone: '',
  profile_image_url: '', // Changed to match the submit payload
  bio: '',
  name: '',
  email: '',
});
const loading = ref(false);

// 2. Fetch data based on props
async function fetchUserData() {
  if (!props.userId) {
    toast.error('No User ID provided to the modal.');
    return;
  }

  try {
    loading.value = true;
    const res = await axios.get(route('proxy.get'), {
      params: {
        endpoint: `users/${props.userId}`
      },
    });

    if (!res.data || !res.data.data) {
      throw new Error('User data could not be found.');
    }

    const userData = res.data.data;
    
    // Update form with fetched data
    form.phone = userData.phone || '';
    form.bio = userData.bio || '';
    form.name = userData.name || '';
    form.email = userData.email || '';
    form.profile_image_url = userData.profile_image_url || '';

  } catch (error: any) {
    console.error('User data fetch error:', error);
    toast.error(error.message || 'Failed to load user data.');
    emit('close'); // Close the modal if data fails to load
  } finally {
    loading.value = false;
  }
}

// 3. Watch for the modal to become visible and fetch data
watch(() => props.isVisible, (newValue) => {
  if (newValue && props.userId) {
    fetchUserData();
  } else {
    // Reset the form when the modal is hidden
    form.reset();
  }
});

// Watch for vue-tel-input object and convert to string
watch(() => form.phone, (val) => {
  if (typeof val === 'object' && val !== null && 'number' in val) {
    form.phone = (val as any).number || '';
  }
});

// 4. Refactored submit function
const submit = async () => {
  if (!props.userId) {
    toast.error('User ID is missing. Cannot update profile.');
    return;
  }

  form.processing = true;

  try {
    // Always use PUT for editing a specific user
    await axios.put(
      route('proxy.put'),
      { // Ensure payload keys match backend expectations
        phone: form.phone,
        profile_image_url: form.profile_image_url,
        bio: form.bio,
        name: form.name,
        email: form.email,
      },
      {
        params: {
          endpoint: `users/${props.userId}`, // Use the ID from props
        },
      }
    );

    toast.success('Profile updated successfully!');
    emit('saved'); // Notify parent component
    emit('close'); // Close the modal on success

  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Update failed. Please try again.');
    console.error('Profile update error:', error);
  } finally {
    form.processing = false;
  }
};
</script>

<template>
  <Head title="Profile Edit" />

  <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="isVisible" class="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="ease-in duration-200" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div class="relative z-10 max-w-2xl w-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl backdrop-blur-md">
            <h2 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Edit Profile</h2>

            <form @submit.prevent="submit" class="space-y-6">
              <!-- Name -->
              <div class="space-y-1">
                <Label for="name" class="font-semibold text-gray-700 dark:text-gray-300">Name</Label>
                <Input id="name" v-model="form.name" type="text" placeholder="Enter full name" class="w-full" />
                <InputError :message="form.errors.name" />
              </div>
              
              <!-- Email -->
              <div class="space-y-1">
                <Label for="email" class="font-semibold text-gray-700 dark:text-gray-300">Email</Label>
                <Input id="email" v-model="form.email" type="email" placeholder="Enter email" class="w-full" />
                <InputError :message="form.errors.email" />
              </div>

              <!-- Phone -->
              <div class="space-y-1">
                <Label for="phone" class="font-semibold">Phone</Label>
                <vue-tel-input v-model="form.phone" mode="international" :validCharactersOnly="true"
                  placeholder="Enter phone number"
                  class="w-full dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400" />
                <InputError :message="form.errors.phone" />
              </div>

              <!-- Bio -->
              <div class="space-y-1">
                <Label for="bio" class="font-semibold text-gray-700 dark:text-gray-300">Bio</Label>
                <Input id="bio" v-model="form.bio" type="text" placeholder="A short bio" class="w-full" />
                <InputError :message="form.errors.bio" />
              </div>

              <!-- Profile Picture URL -->
              <div class="space-y-1">
                <Label for="image" class="font-semibold text-gray-700 dark:text-gray-300">Profile Picture URL</Label>
                <Input id="image" v-model="form.profile_image_url" type="url" placeholder="https://example.com/image.jpg" class="w-full" />
                <InputError :message="form.errors.profile_image_url" />
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4">
                <Button type="button" @click="$emit('close')" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" :disabled="form.processing">
                  Update Profile
                </Button>
              </div>
            </form>
          </div>
        </transition>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <dotlottie-player src="https://lottie.host/1cbfa9df-7c2c-42c9-a861-f59ca88127f8/OrEOfu2zUL.lottie"
          background="transparent" speed="1" style="width: 100px; height: 100px" loop autoplay></dotlottie-player>
      </div>
    </div>
  </transition>
</template>
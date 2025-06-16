<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm, router, Head } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/InputError.vue';
import axios from 'axios'; // Use your configured axios instance
import { useAuthStore } from '@/stores/authStore';
import { getAuth } from 'firebase/auth';

const toast = useToast();
const authStore = useAuthStore();

const form = useForm({
  name: '',
  role: '',
  bio: '',
  profile_image_url: '',
  email: '',
  id: '', 
  phone: '',
});

const initializeFormWithFirebaseData = () => {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (firebaseUser) {
    // Pre-fill the form with data from Firebase
    form.id = firebaseUser.uid;
    form.email = firebaseUser.email || '';
    form.phone = firebaseUser.phoneNumber || '';
    form.name = firebaseUser.displayName || '';
    form.profile_image_url = firebaseUser.photoURL || '';
  }
};

onMounted(async () => {
  if (!authStore.user) {
    await authStore.initAuth();
  }
  if (authStore.user) {
    initializeFormWithFirebaseData();
  } else {
    toast.error('You need to be logged in to create a profile.');
    router.visit('/login');
  }
});


// --- SIMPLIFIED submit function using only POST ---
const submit = async () => {

  form.processing = true; // Use Inertia's processing state

  try {
    // The payload is simply the current form data
    const payload = form.data();

    console.log("🔄 Submitting authorPayload:", payload);
    
    // Always use POST. The backend should handle "update or create".
    await axios.post(
  route('proxy.post'),
  payload,
  {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      endpoint: 'users', // The backend uses this to route internally
    },
  }
);
    
    toast.success('Profile saved successfully!');
    router.visit('/dashboard');

  } catch (error: any) {
console.error('📛 Full error response:', error.response.data.error);
}
};
</script>


<template>
  <Head title="Edit Profile" />
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-gradient">
    <div class="absolute inset-0 bg-[length:400%_400%] animate-gradientBlur"></div>

    <div class="relative z-10 max-w-2xl w-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl backdrop-blur-md">
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Edit Profile</h2>

      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <Label for="name" class="font-semibold text-gray-700 dark:text-gray-300">Name</Label>
          <Input id="name" v-model="form.name" type="text" placeholder="Enter your full name" class="w-full mt-1" />
          <InputError :message="form.errors.name" class="mt-1" />
        </div>

        <div>
          <Label for="email" class="font-semibold text-gray-700 dark:text-gray-300">Email</Label>
          <Input id="email" v-model="form.email" type="email" placeholder="Enter your email" class="w-full mt-1" />
          <InputError :message="form.errors.email" class="mt-1" />
        </div>

        <div>
          <Label for="profile_image_url" class="font-semibold text-gray-700 dark:text-gray-300">Profile Image URL (Optional)</Label>
          <Input id="profile_image_url" v-model="form.profile_image_url" type="url" placeholder="https://example.com/image.png" class="w-full mt-1" />
          <InputError :message="form.errors.profile_image_url" class="mt-1" />
        </div>

        <div>
            <Label for="role" class="font-semibold text-gray-700 dark:text-gray-300">Role</Label>
            <select id="role" v-model="form.role" class="w-full mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm">
                <option disabled value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
            </select>
            <InputError :message="form.errors.role" class="mt-1" />
        </div>

        <div class="space-y-1">
          <Label for="bio" class="font-semibold text-gray-700 dark:text-gray-300">Bio</Label>
          <Input id="bio" v-model="form.bio" type="text" placeholder="Tell us a little about yourself" class="w-full mt-1" />
          <InputError :message="form.errors.bio" class="mt-1" />
        </div>

        <Button type="submit" :disabled="form.processing" class="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105">
            {{ form.processing ? 'Updating...' : isEditMode ? 'Update Profile' : 'Create Profile' }}
        </Button>
      </form>
    </div>
  </div>
</template>
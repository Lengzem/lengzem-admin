<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm, router, Head } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/InputError.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore'; // 1. IMPORT THE AUTH STORE
import { getAuth, getUser } from 'firebase/auth';

const toast = useToast();
const authStore = useAuthStore(); // 2. INSTANTIATE THE STORE

// Form to manage input data
const form = useForm({
  name: '',
  role: '',
  bio: '',
  profile_image_url: '',
  email: '',
  id: '', 
  phone: '',
});

let isEditMode = ref(false); // To track whether it's in an edit mode or create mode

// --- Fetch profile data from API ---
const fetchProfile = async () => {
  if (!authStore.user) return; // Safety check

  try {
    // Log the user object to debug
    console.log("Firebase User Data:", authStore.user);

    // Fetch additional data from Firebase
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      form.id = user.uid;  // Firebase UID
      form.phone = user.phoneNumber || '';  // Firebase phone number
      form.email = user.email || '';  // Firebase email

      console.log("Form Data after Firebase info:", form.data());
    } else {
      toast.error('Firebase user data not found.');
      return;
    }

    // 3. SIMPLIFIED API CALL
    const response = await axios.get(route('proxy.get'), {
        params: {
            endpoint: `users/${authStore.user.uid}`,
        },
    });

    const profileData = response.data.data;

    // Prefill the form with profile data
    if (profileData) {
      form.defaults({
        name: profileData.name || '',
        role: profileData.role || '',
        bio: profileData.bio || '',
        profile_image_url: profileData.profile_image_url || '',
      });

      isEditMode.value = true;
    } else {
      isEditMode.value = false;
    }

    form.reset(); // Reset after pre-filling
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

// Fetch user data from Firebase directly
const fetchFirebaseUserData = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    console.log('Firebase User:', user);
    form.id = user.uid;
    form.phone = user.phoneNumber || ''; // Fetch phone number from Firebase user object
    form.email = user.email || ''; // Fetch email from Firebase user object
  } else {
    console.log('No Firebase user found');
  }
};

// --- onMounted logic ---
onMounted(async () => {
  if (!authStore.user) {
    await authStore.initAuth();
  }

  if (authStore.user) {
    // Fetch the user profile data after the auth is initialized
    await fetchProfile();
    await fetchFirebaseUserData();
  } else {
    toast.error('You need to be logged in to edit your profile.');
    router.visit('/login');
  }
});

// --- Submit function for creating/updating profile ---
const submit = async () => {
  if (!authStore.user) {
    toast.error('User session not found. Please log in again.');
    return;
  }

  try {
    const payload = {
      ...form.data(),
    };
    console.log(payload)

    // Conditionally choose POST or PUT based on whether it's a new profile or editing an existing one
    const apiMethod = isEditMode.value;
    console.log(apiMethod)

    if (apiMethod) {
      await axios.put(
      route('proxy.put'),
      payload,
      {
        params: {
          endpoint: `users/${authStore.user.uid}`, // Use UID from the store
        },
      }
    );
    } else {
      await axios.post(route('proxy.post'),
      payload,
      {
        params: {
          endpoint: 'users', // Use UID from the store
        },
      }
    );
    }
    toast.success(isEditMode.value ? 'Profile updated successfully!' : 'Profile created successfully!');
    router.visit('/dashboard');
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
        form.errors = error.response.data.errors;
        toast.error('Please correct the errors in the form.');
    } else {
        toast.error('An unexpected error occurred during the update.');
    }
    console.error('Profile submit error:', error);
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
                <option value="reader">Reader</option>
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
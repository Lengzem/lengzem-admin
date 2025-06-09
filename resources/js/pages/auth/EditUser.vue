<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm, router, Head } from '@inertiajs/vue3';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/InputError.vue';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

const toast = useToast();

const firebaseUid = ref('');
const firebaseToken = ref('');

// --- CHANGE 1: Simplified the form object ---
// Timestamps (created_at, updated_at) should be handled by the backend, not the client.
// The form should only contain fields the user can edit.
const form = useForm({
  name: '',
  role: '',
  bio: '',
  profile_image_url: '', // Added this field
});

// --- CHANGE 2: Fetch existing user data on mount ---
onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      firebaseUid.value = currentUser.uid;
      firebaseToken.value = await currentUser.getIdToken();

      console.log('Firebase Token:', firebaseToken.value);

      // Fetch the user's existing profile data to pre-fill the form
      try {
        const response = await axios.get(route('proxy.get'), {
            headers: {
                'Authorization': `Bearer ${firebaseToken.value}`
            },
            params: {
                endpoint: `users/${firebaseUid.value}`, // Assuming your proxy can handle this
            },
        });

        // Populate the form with the fetched data
        const profileData = response.data;
        form.defaults({
            name: profileData.name || '',
            role: profileData.role || '',
            bio: profileData.bio || '',
            profile_image_url: profileData.profile_image_url || '',
        });
        form.reset(); // Applies the default values to the form

      } catch (error) {
        // This might happen if the user is new and has no profile record yet.
        // It's okay to fail silently and just show a blank form.
        console.warn('Could not fetch existing user profile. A new one will be created.', error);
      }

    } else {
      toast.error('You need to be logged in to edit your profile.');
      router.visit('/login');
    }
  });
});

// --- CHANGE 3: Removed getFormattedDateTime() as it's not needed ---

const submit = async () => {
  if (!firebaseUid.value || !firebaseToken.value) {
    toast.error('Firebase user not found. Please log in again.');
    return;
  }

  try {
    // --- CHANGE 4: Simplified the payload ---
    // The backend should handle timestamps and know which user is being updated via the UID.
    // The email and isAccountComplete flags should also likely be handled server-side
    // or sent only when necessary.
    const payload = {
      ...form.data(), // Contains name, role, bio, profile_image_url
      uid: firebaseUid.value,
    };

    // We use a PUT or PATCH request for updating, but POST can also work depending on your API design.
    // Sticking with your original POST to the proxy.
    await axios.put(
      route('proxy.put'),
      payload,
      {
        headers: {
          'Authorization': `Bearer ${firebaseToken.value}`
        },
        params: {
          endpoint: 'users', // Your proxy endpoint for creating/updating a user
        },
      }
    );

    toast.success('Profile updated successfully!');
    router.visit('/dashboard'); // Or to a profile view page
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.errors) {
        // Handle Inertia validation errors from the backend
        form.errors = error.response.data.errors;
        toast.error('Please correct the errors in the form.');
    } else {
        toast.error('An unexpected error occurred during the update.');
    }
    console.error('Profile update error:', error);
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

        <!-- --- CHANGE 5: Added Profile Image URL input field --- -->
        <div>
          <Label for="profile_image_url" class="font-semibold text-gray-700 dark:text-gray-300">Profile Image URL (Optional)</Label>
          <Input id="profile_image_url" v-model="form.profile_image_url" type="url" placeholder="https://example.com/image.png" class="w-full mt-1" />
          <InputError :message="form.errors.profile_image_url" class="mt-1" />
        </div>

        <div>
            <Label for="role" class="font-semibold text-gray-700 dark:text-gray-300">Role</Label>
            <!-- --- CHANGE 6: Removed invalid type="text" from select --- -->
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
          <!-- --- CHANGE 7: Fixed typo in error message key --- -->
          <InputError :message="form.errors.bio" class="mt-1" />
        </div>

        <Button type="submit" :disabled="form.processing" class="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105">
            {{ form.processing ? 'Updating...' : 'Update Profile' }}
        </Button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { getDeviceInfo } from '@/utils/device';
import { VueTelInput } from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import LogoutBut from '../../components/ui/button/Logout.vue'

interface Props {
  status?: string;
}
defineProps<Props>();

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Profile settings', href: '/settings/profile' },
];

// Refs
const deviceInfo = ref({});
const profilePicInput = ref<HTMLInputElement | null>(null);
const profilePicPreview = ref<string>('/default-avatar.png');
const showSuccessToast = ref(false);
const isSubmitting = ref(false);
const phoneNumber = ref('');
const isPhoneInputReady = ref(true); // used for disabling submit if needed

// Page data
const page = usePage<SharedData>();
const user = page.props.auth.user as User;

// Form setup
const form = useForm({
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  city: user.city || '',
  street: user.street || '',
  dob: user.dob ? user.dob.split('T')[0] : '',
  country: user.country || '',
  profile_picture: null as File | null,
  updated_at: user.updated_at,
  isAccountComplete: user.isAccountComplete,
  lastLogin: user.lastLogin,
  device_id: '',
  device_name: '',
});

const customErrors = reactive({
  phone: '',
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    form.profile_picture = target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(form.profile_picture);
  }
};

const triggerFileInput = () => {
  profilePicInput.value?.click();
};

const onPhoneValidate = (isValid: boolean, number: string) => {
  isPhoneInputReady.value = isValid;
  if (!isValid) {
    customErrors.phone = 'Invalid phone number';
  } else {
    form.phone = number;
  }
};

const validateForm = (): boolean => {
  let isValid = true;
  form.clearErrors();
  customErrors.phone = '';

  if (!phoneNumber.value || !isPhoneInputReady.value) {
    customErrors.phone = 'Phone number is required';
    isValid = false;
  }

  const requiredFields = [
    { field: 'name', message: 'Name is required' },
    { field: 'email', message: 'Email is required' },
    { field: 'city', message: 'City is required' },
    { field: 'street', message: 'Street is required' },
    { field: 'dob', message: 'Date of birth is required' },
    { field: 'country', message: 'Country is required' }
  ];

  requiredFields.forEach(({ field, message }) => {
    if (!form[field as keyof typeof form]) {
      form.setError(field, message);
      isValid = false;
    }
  });

  return isValid;
};

const submit = async () => {
  form.phone = phoneNumber.value.replace(/\s+/g, '');

  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    await form.post(route('profile.test'), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        showSuccessToast.value = true;
        setTimeout(() => showSuccessToast.value = false, 3000);
      },
      onError: (errors) => {
        if (errors.phone) {
          customErrors.phone = errors.phone;
        }
      },
    });
  } finally {
    isSubmitting.value = false;
  }
};


onMounted(() => {
  nextTick(() => {
    const info = getDeviceInfo();
    deviceInfo.value = info;
    form.device_id = info?.device || 'Unknown device';
    form.device_name = `${info?.os || 'Unknown OS'} | ${info?.browser || 'Unknown browser'}`;
    phoneNumber.value = user.phone || '';
    if (user.profile_picture) {
      profilePicPreview.value = `/storage/${user.profile_picture}`;
    }
  });
});
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Head title="Profile settings" />

    <SettingsLayout>
      <div class="flex flex-col space-y-6">
        <HeadingSmall 
          title="Profile information" 
          description="Update your name, email, and personal details" 
        />

        <form @submit.prevent="submit" class="space-y-6" enctype="multipart/form-data">
          <!-- Profile Picture -->
          <div class="relative mx-auto w-32 h-32">
            <img 
              :src="profilePicPreview" 
              class="w-full h-full rounded-full object-cover border-4 border-gray-300 cursor-pointer" 
              @click="triggerFileInput" 
              alt="Profile picture"
            />
            <div 
              class="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer" 
              @click="triggerFileInput"
            >
              <i class="fas fa-camera text-gray-600"></i>
            </div>
            <input 
              ref="profilePicInput" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleFileChange" 
            />
          </div>

          <!-- Name -->
          <div class="grid gap-2">
            <Label for="name">Name <span class="text-red-500">*</span></Label>
            <Input id="name" v-model="form.name" required :disabled="isSubmitting" />
            <InputError :message="form.errors.name" />
          </div>

          <!-- Email -->
          <div class="grid gap-2">
            <Label for="email">Email <span class="text-red-500">*</span></Label>
            <Input id="email" type="email" v-model="form.email" required :disabled="isSubmitting" />
            <InputError :message="form.errors.email" />
          </div>

          <!-- Phone -->
          <div class="grid gap-2">
            <Label for="phone">Phone <span class="text-red-500">*</span></Label>
            <vue-tel-input v-model="phoneNumber" :disabled="isSubmitting" :validCharactersOnly="true" mode="international" @validate="onPhoneValidate" />
            <InputError :message="customErrors.phone" />
          </div>

          <!-- City -->
          <div class="grid gap-2">
            <Label for="city">City <span class="text-red-500">*</span></Label>
            <Input id="city" v-model="form.city" :disabled="isSubmitting" />
            <InputError :message="form.errors.city" />
          </div>

          <!-- Street -->
          <div class="grid gap-2">
            <Label for="street">Street <span class="text-red-500">*</span></Label>
            <Input id="street" v-model="form.street" :disabled="isSubmitting" />
            <InputError :message="form.errors.street" />
          </div>

          <!-- Country -->
          <div class="grid gap-2">
            <Label for="country">Country <span class="text-red-500">*</span></Label>
            <Input id="country" v-model="form.country" :disabled="isSubmitting" />
            <InputError :message="form.errors.country" />
          </div>

          <!-- DOB -->
          <div class="grid gap-2">
            <Label for="dob">Date of Birth <span class="text-red-500">*</span></Label>
            <Input id="dob" type="date" v-model="form.dob" :disabled="isSubmitting" />
            <InputError :message="form.errors.dob" />
          </div>

          <!-- Submit -->
          <div class="flex items-center gap-4">
            <Button type="submit" :disabled="form.processing || !isPhoneInputReady || isSubmitting">
              <span v-if="isSubmitting">Saving...</span>
              <span v-else>Save Changes</span>
            </Button>
          </div>
        </form>

        <!-- Toast -->
        <transition name="fade">
          <div
            v-if="showSuccessToast"
            class="fixed top-10 right-5 px-4 py-2 rounded bg-green-600 text-white shadow-lg"
          >
            Profile updated successfully!
          </div>
        </transition>
        <LogoutBut />
      </div>
    </SettingsLayout>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

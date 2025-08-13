<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useForm, router, Head } from '@inertiajs/vue3';
import { signInWithPhoneNumber, RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/firebase';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

import AuthBase from '@/layouts/AuthLayout.vue';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const toast = useToast();

const isOtpSent = ref(false);
const confirmationResult = ref<ConfirmationResult | null>(null);
const digitBoxes = ref(['', '', '', '', '', '']);
const inputRefs = Array.from({ length: 6 }, () => ref<HTMLInputElement | null>(null));

const form = useForm({
  phone: '',
  otp: '',
});

watch(digitBoxes.value, () => {
  form.otp = digitBoxes.value.join('');
});

const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, ''); // digits only

  if (value.length > 1) {
    const digits = value.slice(0, 6).split('');
    digits.forEach((digit, i) => digitBoxes.value[i] = digit);
    form.otp = digits.join('');
    inputRefs[Math.min(digits.length, 5)]?.value?.focus();
    return;
  }

  digitBoxes.value[index] = value;

  if (value && index < 5) {
    inputRefs[index + 1]?.value?.focus();
  }
};

const handleBackspace = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !digitBoxes.value[index] && index > 0) {
    inputRefs[index - 1]?.value?.focus();
  }
};

onMounted(() => {
  const authStore = useAuthStore();
  if (authStore.user) {
    const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
    router.visit(redirectTo);
  }
  setupRecaptcha();
});

const setupRecaptcha = () => {
  if ((window as any).recaptchaVerifier) return;

  (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible',
    'expired-callback': () => {
      toast.error("reCAPTCHA expired, please try sending the code again.");
      form.processing = false;
    }
  });
};

const sendOtp = async () => {
  if (!form.phone || !/^\+[1-9]\d{1,14}$/.test(form.phone)) {
    form.setError('phone', 'Phone number dik tak ziak rawh (e.g., +919876543210).');
    toast.error('Phone number format a dik lo. Ram code telh rawh.');
    return;
  }
  form.clearErrors();
  form.processing = true;

  try {
    const appVerifier = (window as any).recaptchaVerifier;
    const result = await signInWithPhoneNumber(auth, form.phone, appVerifier);

    confirmationResult.value = result;
    isOtpSent.value = true;
    toast.success(`OTP thawn a ni e ${form.phone}-ah`);
  } catch (error: any) {
    console.error('🔥 OTP Send Error:', error);
    let errorMessage = 'OTP thawn a kal tluang lo. Ti tha leh rawh.';
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'He phone number hian a/c a awm lo.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'I ti nawn zing lutuk. Rei lo te hnuah ti tha leh rawh.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network chhia. Check phawt rawh.';
          break;
      }
    }
    form.setError('phone', errorMessage);
    toast.error(errorMessage);
  } finally {
    form.processing = false;
  }
};

const verifyOtpAndLogin = async () => {
  if (!confirmationResult.value) {
    toast.error("Tihsual a awm. Bul atangin tan leh rawh.");
    return;
  }

  if (form.otp.length !== 6) {
    form.setError('otp', 'OTP hi character 6 a ni tur a ni.');
    toast.error('OTP kim chang ziak rawh.');
    return;
  }

  form.clearErrors();
  form.processing = true;

  confirmationResult.value.confirm(form.otp)
    .then((userCredential) => {
      const user = userCredential.user;
      toast.success('Login a tlang!', { timeout: 2000 });

      axios.get(route('proxy.get'), {
        params: {
          endpoint: `users/${user.uid}`,
        },
      })
      .then((response) => {
        const profileData = response.data.data;
        if (!profileData.phone || !profileData.role) {
          toast.info('I profile siam zo phawt rawh.');
          router.get(route('ProEdit'));
        } else {
          const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
          router.get(redirectTo);
        }
      })
      .catch(() => {
        toast.info('I profile siam zo phawt rawh.');
        router.get(route('ProEdit'));
      });
    })
    .catch((error) => {
      console.error('🔥 OTP Confirmation Error:', error);
      let errorMessage = 'Login fuh lo. Ti tha leh rawh.';
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-verification-code':
            errorMessage = 'I OTP ziahluh a dik lo.';
            form.setError('otp', errorMessage);
            break;
          case 'auth/code-expired':
            errorMessage = 'OTP a thi. A thar lam leh rawh.';
            isOtpSent.value = false;
            break;
        }
      }
      toast.error(errorMessage);
    })
    .finally(() => {
      form.processing = false;
    });
};
</script>

<template>
    <AuthBase title="Login rawh" description="I phone number hmangin lut rawh">
      <Head title="Log in" />
      <div id="recaptcha-container"></div>
  
      <form @submit.prevent class="flex flex-col gap-6">
        <!-- STEP 1: Phone -->
        <div v-if="!isOtpSent" class="grid gap-6">
          <div class="grid gap-2">
            <Label for="phone">Phone Number</Label>
            <Input id="phone" type="tel" required autofocus v-model="form.phone" placeholder="+919876543210"
              autocomplete="tel" :disabled="form.processing" />
            <InputError :message="form.errors.phone" />
          </div>
          <Button @click="sendOtp" type="button" class="mt-4 w-full" :disabled="form.processing">
            {{ form.processing ? 'OTP Thawn mek...' : 'OTP hmangin lut rawh' }}
          </Button>
        </div>
  
        <!-- STEP 2: OTP -->
        <div v-else class="grid gap-6">
          <div class="grid gap-2">
            <Label>OTP Code</Label>
            <p class="text-sm text-muted-foreground">
              OTP code i phone number <span class="font-semibold">{{ form.phone }}</span> a kan thawn kha ziak lut rawh.
            </p>
            <div class="flex justify-between gap-2">
              <input
                v-for="(digit, index) in digitBoxes"
                :key="index"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-10 h-12 text-center text-xl border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                v-model="digitBoxes[index]"
                :ref="el => inputRefs[index].value = el"
                @input="handleInput($event, index)"
                @keydown="handleBackspace($event, index)"
              />
            </div>
            <InputError :message="form.errors.otp" class="mt-1" />
          </div>
          <Button @click="verifyOtpAndLogin" type="button" class="mt-2 w-full" :disabled="form.processing">
            {{ form.processing ? 'Tihfel mek...' : 'Login' }}
          </Button>
          <button @click="isOtpSent = false; form.otp = ''; digitBoxes = ['','','','','','']" type="button"
            class="text-sm text-center text-muted-foreground hover:underline">
            Phone number dik lo? Siam tha leh rawh.
          </button>
        </div>
      </form>
  
      <div v-if="form.processing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      </div>
    </AuthBase>
  </template>
  

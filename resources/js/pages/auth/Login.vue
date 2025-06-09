<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import {
    signInWithPhoneNumber,
    RecaptchaVerifier,
    type ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/firebase';
// NO axios import needed anymore
import { useAuthStore } from '@/stores/authStore';

import AuthBase from '@/layouts/AuthLayout.vue';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const toast = useToast();

const isOtpSent = ref(false);
const confirmationResult = ref<ConfirmationResult | null>(null);

const form = useForm({
    phone: '',
    otp: '',
});

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
                    errorMessage = 'He phone number hian a/c a awm lo.'; // More accurate message for login
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

// --- SIMPLIFIED: Verify OTP and redirect based on Firebase data ONLY ---
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

    try {
        // Step 1: Confirm the OTP with Firebase
        const userCredential = await confirmationResult.value.confirm(form.otp);
        const user = userCredential.user;

        toast.success('Login a tlang!', { timeout: 2000 });
        
        // Step 2: Redirect based on the displayName property from Firebase Auth
        if (!user.displayName) {
            // If the user has no display name, their profile is incomplete.
            toast.info('I profile siam zo phawt rawh.');
            router.get(route('ProEdit'));
        } else {
            // Otherwise, their profile is complete. Go to the dashboard.
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
            router.get(redirectTo);
        }

    } catch (error: any) {
        console.error('🔥 Login error:', error);
        let errorMessage = 'Login fuh lo. Ti tha leh rawh.';
        
        if (error.code) { // Firebase errors
            switch (error.code) {
                case 'auth/invalid-verification-code':
                    errorMessage = 'I OTP ziahluh a dik lo.';
                    form.setError('otp', errorMessage);
                    break;
                case 'auth/code-expired':
                    errorMessage = 'OTP a thi. A thar lam leh rawh.';
                    isOtpSent.value = false; // Go back to step 1
                    break;
            }
        }

        toast.error(errorMessage);
    } finally {
        form.processing = false;
    }
};
</script>

<template>
    <!-- The template remains exactly the same as the previous version -->
    <AuthBase title="Login rawh" description="I phone number hmangin lut rawh">
        <Head title="Log in" />

        <div id="recaptcha-container"></div>

        <form @submit.prevent class="flex flex-col gap-6">
            <!-- STEP 1: Enter Phone Number -->
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

            <!-- STEP 2: Enter OTP -->
            <div v-else class="grid gap-6">
                 <div class="grid gap-2">
                    <Label for="otp">OTP Code</Label>
                    <p class="text-sm text-muted-foreground">OTP code i phone number <span class="font-semibold">{{ form.phone }}</span> a kan thawn kha ziak lut rawh.</p>
                    <Input id="otp" type="text" inputmode="numeric" required v-model="form.otp" placeholder="_ _ _ _ _ _"
                        autocomplete="one-time-code" maxlength="6" :disabled="form.processing" />
                    <InputError :message="form.errors.otp" />
                </div>
                <Button @click="verifyOtpAndLogin" type="button" class="mt-2 w-full" :disabled="form.processing">
                    {{ form.processing ? 'Tihfel mek...' : 'Login' }}
                </Button>
                 <button @click="isOtpSent = false; form.otp = ''" type="button" class="text-sm text-center text-muted-foreground hover:underline">
                    Phone number dik lo? Siam tha leh rawh.
                </button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Account nei lo tan?
                <TextLink :href="route('register')">Sign up</TextLink>
            </div>
        </form>

        <div v-if="form.processing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <dotlottie-player src="https://lottie.host/1cbfa9df-7c2c-42c9-a861-f59ca88127f8/OrEOfu2zUL.lottie" background="transparent" speed="1" style="width: 100px; height: 100px" loop autoplay></dotlottie-player>
        </div>
    </AuthBase>
</template>
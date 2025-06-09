<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import { LoaderCircle } from 'lucide-vue-next';
import {
    updateProfile,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    type ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/firebase';
import axios from 'axios';

import { useAuthStore } from '@/stores/authStore'; // ✅ import authStore
const authStore = useAuthStore(); // ✅ use the store

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
    name: '',
    phone: '',
    otp: '',
});

const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'expired-callback': () => {
                toast.error("reCAPTCHA expired, please try sending the code again.");
            }
        });
    }
};

onMounted(() => {
    setupRecaptcha();
});

const sendOtp = async () => {
    if (!form.name) {
        form.setError('name', 'Hming ziah a ngai.');
        toast.error('I hming ziak phawt rawh.');
        return;
    }
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
                    errorMessage = 'I phone number ziah dan a dik lo.';
                    form.setError('phone', errorMessage);
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'I ti nawn zing lutuk. Rei lo te hnuah ti tha leh rawh.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network chhia. Check phawt rawh.';
                    break;
            }
        }
        toast.error(errorMessage);
    } finally {
        form.processing = false;
    }
};

const submit = async () => {
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
        const userCredential = await confirmationResult.value.confirm(form.otp);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: form.name,
        });

        // ✅ Call initAuth to save user and token to authStore
        await authStore.initAuth();

        // Optional: update display name in store if needed
        authStore.user = {
            uid: user.uid,
            email: user.email ?? '',
        };

        const payload = {
            id: user.uid,
            name: form.name,
            phone: user.phoneNumber,
            email: null,
            role: null,
            bio: null,
            profile_image_url: null,
        };

        console.log('data:', payload);

        await axios.post(route('proxy.post'), payload, {
            params: {
                endpoint: 'users',
            },
        });

        toast.success('Account siam a zo tawh e! Profile siam chhunzawm rawh.');
        router.get(route('ProEdit'));

    } catch (error: any) {
        console.error('🔥 Registration Error:', error);
        let errorMessage = 'Account siam fuh lo. Ti tha leh rawh.';

        if (error.response) {
            errorMessage = error.response.data.message || 'Error saving profile to server.';
        } else if (error.code) {
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
    } finally {
        form.processing = false;
    }
};
</script>

<template>
    <AuthBase title="Account Siamna" description="I hming leh phone number hmangin register rawh">

        <Head title="Register" />
        <div id="recaptcha-container"></div>

        <form @submit.prevent class="flex flex-col gap-6">
            <div v-if="!isOtpSent" class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="name">Hming</Label>
                    <Input id="name" type="text" required v-model="form.name" placeholder="Your full name"
                        :disabled="form.processing" />
                    <InputError :message="form.errors.name" />
                </div>
                <div class="grid gap-2">
                    <Label for="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required v-model="form.phone" placeholder="+919876543210"
                        autocomplete="tel" :disabled="form.processing" />
                    <InputError :message="form.errors.phone" />
                </div>
                <Button @click="sendOtp" type="button" class="mt-2 w-full" :disabled="form.processing">
                    <LoaderCircle v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
                    {{ form.processing ? 'OTP Thawn mek...' : 'OTP Lam Rawh' }}
                </Button>
            </div>

            <div v-else class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="otp">OTP Code</Label>
                    <p class="text-sm text-muted-foreground">OTP code i phone number <span class="font-semibold">{{
                form.phone }}</span> a kan thawn kha ziak lut rawh.</p>
                    <Input id="otp" type="text" inputmode="numeric" required v-model="form.otp"
                        placeholder="_ _ _ _ _ _" autocomplete="one-time-code" maxlength="6"
                        :disabled="form.processing" />
                    <InputError :message="form.errors.otp" />
                </div>
                <Button @click="submit" type="button" class="mt-2 w-full" :disabled="form.processing">
                    <LoaderCircle v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
                    {{ form.processing ? 'Tihfel mek...' : 'Verify & Register' }}
                </Button>
                <button @click="isOtpSent = false; form.otp = ''" type="button"
                    class="text-sm text-center text-muted-foreground hover:underline">
                    Phone number dik lo? Siam tha leh rawh.
                </button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Account i neih tawh chuan?
                <TextLink :href="route('login') " class="underline underline-offset-4">Login rawh</TextLink>
            </div>
        </form>

        <div v-if="form.processing"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <dotlottie-player src="https://lottie.host/1cbfa9df-7c2c-42c9-a861-f59ca88127f8/OrEOfu2zUL.lottie"
                background="transparent" speed="1" style="width: 100px; height: 100px" loop autoplay></dotlottie-player>
        </div>
    </AuthBase>
</template>

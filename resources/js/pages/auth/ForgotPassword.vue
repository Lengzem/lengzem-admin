<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { Head } from '@inertiajs/vue3';
import { LoaderCircle } from 'lucide-vue-next';
import { ref } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase'; // your firebase.ts file
import { useToast } from 'vue-toastification';

const status = ref('');
const email = ref('');
const error = ref('');
const processing = ref(false);
const toast = useToast();

const submit = async () => {
    processing.value = true;
    status.value = '';
    error.value = '';

    try {
        await sendPasswordResetEmail(auth, email.value);
        toast.success('📩 Password siamthatna email tawn ani! Email check rawh.');
    } catch (err: any) {
        toast.error(err.message || '❌ A thawn theih loh, dik lo a awm.');
    } finally {
        processing.value = false;
    }
};
</script>

<template>
    <AuthLayout title="Forgot password" description="Password thlak tur in i email ziak lut rawh">
        <Head title="Forgot password" />

        <div class="space-y-6">
            <form @submit.prevent="submit">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        v-model="email"
                        autofocus
                        placeholder="email@example.com"
                    />
                    <InputError :message="error" />
                </div>

                <div class="my-6 flex items-center justify-start">
                    <Button class="w-full" :disabled="processing">
                        <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
                        Email password reset link
                    </Button>
                </div>
            </form>

            <div class="space-x-1 text-center text-sm text-muted-foreground">
                <span>let leh rawh</span>
                <TextLink :href="route('login')">log in</TextLink>
            </div>
        </div>
    </AuthLayout>
</template>

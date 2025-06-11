import '../css/app.css';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h } from 'vue';
import { ZiggyVue } from 'ziggy-js';
import type { DefineComponent } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { initializeTheme } from './composables/useAppearance';
import { useAuthStore } from '@/stores/authStore';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { createHead } from '@vueuse/head';
import { router } from '@inertiajs/vue3';
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';
import PrimeVue from 'primevue/config';

const head = createHead();
const appName = 'Lengzem Admin';

const showLoader = () => {
    if (document.getElementById('firebase-loader')) return;

    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'firebase-loader';
    loaderDiv.style.position = 'fixed';
    loaderDiv.style.inset = '0';
    loaderDiv.style.zIndex = '9999';
    loaderDiv.style.display = 'flex';
    loaderDiv.style.alignItems = 'center';
    loaderDiv.style.justifyContent = 'center';
    loaderDiv.style.background = 'rgba(0, 0, 0, 0.4)';
    loaderDiv.style.backdropFilter = 'blur(4px)';
    loaderDiv.innerHTML = `
        <dotlottie-player 
            src="https://lottie.host/1cbfa9df-7c2c-42c9-a861-f59ca88127f8/OrEOfu2zUL.lottie"
            background="transparent"
            speed="1"
            style="width: 70px; height: 70px"
            loop
            autoplay
        ></dotlottie-player>
    `;
    document.body.appendChild(loaderDiv);
};

const removeLoader = () => {
    const loader = document.getElementById('firebase-loader');
    if (loader) loader.remove();
};

const waitForFirebaseReady = () => {
    return new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            unsubscribe();
            resolve();
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    showLoader();

    waitForFirebaseReady().then(() => {
        createInertiaApp({
            title: (title) => `${title} - ${appName}`,
            resolve: (name) =>
                resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
            setup({ el, App, props, plugin }) {
                const vueApp = createApp({ render: () => h(App, props) });

                const pinia = createPinia();
                vueApp.use(pinia);

                const authStore = useAuthStore();

                authStore.initAuth().then(() => {
                    vueApp.use(plugin);
                    vueApp.use(ZiggyVue);
                    vueApp.use(VueTelInput);
                    vueApp.use(PrimeVue);
                    vueApp.use(Toast, {
                        position: 'top-right',
                        timeout: 3000,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                    vueApp.use(head);

                    vueApp.mount(el);
                    initializeTheme();
                    removeLoader();

                    // Inertia Navigation Loader Hooks 💡
                    router.on('start', () => {
                        showLoader();
                    });

                    router.on('finish', () => {
                        removeLoader();
                    });
                });
            },
            progress: false, // Disable Inertia’s built-in progress bar
        });
    });
});

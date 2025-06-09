<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Player',
        href: '/player',
    },
];


document.addEventListener('DOMContentLoaded', async () => {
        shaka.polyfill.installAll();

        const videoElement = document.getElementById('videoPlayer');
        const player = new shaka.Player(videoElement);

        // Detect the browser (Safari for FairPlay, Chrome/Edge for Widevine)
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isChrome = /Chrome|Chromium|CriOS/i.test(navigator.userAgent);
        const isEdge = /Edg/i.test(navigator.userAgent);

        let drmConfig = {
            drm: {
                servers: {},
                advanced: {}
            }
        };
        
        let link = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';

        if (isSafari) {
            // Safari: Use FairPlay DRM and HLS
            link = 'https://d2p6tylwv92wbq.cloudfront.net/8vCoUAhd7VmmSfNQiHnx9Y/hls/manifest.m3u8';
            drmConfig.drm.servers['com.apple.fps'] = 'https://drm-fairplay-licensing.axprod.net/AcquireLicense';
            drmConfig.drm.advanced['com.apple.fps'] = {
                serverCertificateUri: 'https://vtb.axinom.com/FPScert/fairplay.cer',
            };
        } else if (isChrome) {
            // Chrome: Use Widevine DRM and HLS
            link = 'https://d2p6tylwv92wbq.cloudfront.net/8vCoUAhd7VmmSfNQiHnx9Y/dash/manifest.mpd';
            drmConfig.drm.servers['com.widevine.alpha'] = 'https://drm-widevine-licensing.axprod.net/AcquireLicense';
        } else {
            // Edge: Use PlayReady DRM and HLS
            link = 'https://d2p6tylwv92wbq.cloudfront.net/8vCoUAhd7VmmSfNQiHnx9Y/dash/manifest.mpd';
            drmConfig.drm.servers['com.microsoft.playready'] = 'https://drm-playready-licensing.axprod.net/AcquireLicense';
        }

        player.configure(drmConfig);

        // Add Request Filter for Custom Headers (for Axinom DRM)
        player.getNetworkingEngine().registerRequestFilter((type, request) => {
            if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
                request.headers['X-AxDRM-Message'] =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjogMSwiY29tX2tleV9pZCI6ICIxZmUxODc5Zi01NjIyLTQyYWItOWY0OC1iMjE4MDA5MWU2MTYiLCJtZXNzYWdlIjogeyAgInR5cGUiOiAiZW50aXRsZW1lbnRfbWVzc2FnZSIsICAidmVyc2lvbiI6IDIsICAiY29udGVudF9rZXlzX3NvdXJjZSI6IHsgICAgImlubGluZSI6IFsgICAgICB7ICAgICAgICAiaWQiOiAiNGQwYjM3ODktMTAzNy00MmY3LWE1NDktZjQ5OTk3YzNmMDQ3IiAgICAgIH0gICAgXSAgfX19.s7PiPMw1-RcjoHsoOPnYrGNvN_jGVt0tL_9jMqxxz2M';
            }
        });

        // Load the appropriate manifest
        try {
            await player.load(link);
            console.log('The video has been loaded successfully!');
        } catch (error) {
            console.error('Error loading video:', error);
        }
    });
</script>

<template>
    <Head title="Home" />

    <AppLayout :breadcrumbs="breadcrumbs">


    <div id="video-container" style="width: 100%; max-width: 800px; margin: auto;">
        <video id="videoPlayer" width="100%" controls></video>
    </div>
</AppLayout>
</template>
   
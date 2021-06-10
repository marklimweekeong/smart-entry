<template>
<transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
<q-layout view="lHh Lpr lFf" class="main-page">
    <div class="absolute-center main-camera">
        <div class="cover cover-left"></div>
        <div class="cover cover-right"></div>
        <div class="cover cover-top"></div>
        <div class="cover cover-bottom"></div>
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
    </div>
    <q-header class="bg-transparent">
        <div class="header-buttons">
            <q-btn color="transparent" text-color="white" round unelevated :icon="flashIcon" class="button" no-caps @click="toggleFlash" />
            <q-btn color="transparent" text-color="white" round unelevated icon="flip_camera_ios" class="button" no-caps @click="toggleCamera" />
        </div>
    </q-header>
</q-layout>
</transition>
</template>

<script>
import {
    mapActions
} from 'vuex'
export default {
    emits:['change-background'],
    data() {
        return {
            isFlashOn: false,
            flashIcon: 'flash_off',
            usingFrontCamera: false,
        }
    },
    methods: {
        ...mapActions(['QRCodeStringAction']),
        displayContents(err, text) {
            if (err) {
                // an error occurred, or the scan was canceled (error code `6`)
            } else {
                // The scan completed, display the contents of the QR code:
                this.QRCodeStringAction(text)
                this.$router.push('/')
            }
        },
        toggleFlash() {
            if (this.isFlashOn) {
                this.isFlashOn = false, this.flashIcon = 'flash_off'
                QRScanner.disableLight()
            } else {
                this.isFlashOn = true, this.flashIcon = 'flash_on'
                QRScanner.enableLight()
            }
        },
        toggleCamera() {
            if (this.usingFrontCamera) {
                QRScanner.useBackCamera()
                this.usingFrontCamera = false
            } else {
                QRScanner.useFrontCamera()
                this.usingFrontCamera = true
            }
        }
    },
    mounted() {
        this.$emit('change-background', '')
        QRScanner.scan(this.displayContents)
        QRScanner.show();
    },
    beforeDestroy() {
        this.$emit('change-background', 'white')
        QRScanner.destroy()
    }
}
</script>

<style scoped>
.main-camera {
    width: 250px;
    height: 250px;
    display: flex;
    color: var(--q-color-primary-dark);
    font-size: 20px;
}

.corner {
    width: 50px;
    height: 50px;
    content: '';
    position: absolute;
    border-radius: 5px;
}

.top-left {
    border-top: 5px solid var(--q-color-primary-dark);
    border-left: 5px solid var(--q-color-primary-dark);
    top: 0;
    left: 0;
}

.bottom-right {
    border-right: 5px solid var(--q-color-primary-dark);
    border-bottom: 5px solid var(--q-color-primary-dark);
    bottom: 0;
    right: 0;
}

.top-right {
    border-top: 5px solid var(--q-color-primary-dark);
    border-right: 5px solid var(--q-color-primary-dark);
    top: 0;
    right: 0;
}

.bottom-left {
    border-bottom: 5px solid var(--q-color-primary-dark);
    border-left: 5px solid var(--q-color-primary-dark);
    bottom: 0;
    left: 0;
}

.cover {
    background-color: rgb(0, 0, 0, 0.5);
    position: absolute;
}

.cover-left {
    width: 100vh;
    height: 200vh;
    right: 248px;
    top: -350px;
}

.cover-right {
    width: 100vh;
    height: 200vh;
    left: 248px;
    top: -350px;
}

.cover-top {
    width: 246px;
    height: 50vh;
    left: 2px;
    bottom: 248px;
}

.cover-bottom {
    width: 246px;
    height: 50vh;
    left: 2px;
    top: 248px;
}

.header-buttons {
    position: absolute;
    right: 10px;
    top: 10px;
}

.button {
    font-size: 18px;
    font-weight: 400;
}

.main-page {
    overflow: hidden !important;
}

</style>

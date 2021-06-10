<template>
<div id="q-app" :style="backgroundColorStyle">
    <router-view v-if="!locationActive" :lat="lat" :long="long" @check-gps="checkLocationStatus" @change-background="changeBackground" :style="backgroundColorStyle" />
    <q-layout v-if="locationActive" view="lHh Lpr lFf" style="background-color: white;">
        <div class="absolute-center" style="text-align:center">
            <q-spinner-gears color="primary" size="4em" />
            <div class="subtitle" style="margin-top:15px; font-weight:500">
                Waiting for location
            </div>
        </div>
    </q-layout>
    <img src="./assets/TutorialBackground.jpg" height="1px" style="z-index: -1; position: fixed;">
</div>
</template>

<script>
import {
    mapActions
} from "vuex";
import {
    Database
} from "./database.js";

export default {
    name: "App",
    data() {
        return {
            locationRef: null,
            lat: 0,
            long: 0,
            backgroundColor: 'white',
            tutorialBg: null,
            deviceReady: false
        };
    },
    async created() {
        // document.addEventListener("deviceready", this.onDeviceReady, false);
        // screen.orientation.lock('portrait');
        // StatusBar.styleLightContent()
        // StatusBar.backgroundColorByHexString('#FF282828');
        this.newDb();
        await this.userInformationLoadAction()
        this.noUserInformation()
        await this.locationsLoadAction();
        document.addEventListener("resume", this.onResume, false);
        // await this.checkLocationStatus()
        setTimeout(() => {
            this.lat = 2
        }, 500)
    },
    methods: {
        ...mapActions(["newDb", "locationsLoadAction", "userInformationLoadAction", 'QRCodeStringAction']),
        noUserInformation() {
            if (this.$store.getters.newUser == true) {
                this.$router.push('/tutorial')
            }
        },
        locationOnSuccess(position) {
            this.lat = position.coords.latitude;
            this.long = position.coords.longitude;
        },
        locationOnError(error) {
            alert(`code: ${error.code}\nmessage: ${error.message}`);
        },
        checkLocationStatus() {
            var that = this;
            cordova.plugins.diagnostic.isGpsLocationEnabled(
                function (enabled) {
                    if (enabled) {
                        if (!that.locationRef) {
                            that.locationRef = navigator.geolocation.watchPosition(
                                that.locationOnSuccess,
                                that.locationOnError, {
                                    enableHighAccuracy: true
                                }
                            );
                        }
                    } else {
                        cordova.plugins.locationAccuracy.request(
                            that.onRequestSuccess,
                            that.onRequestFailure,
                            cordova.plugins.locationAccuracy
                            .REQUEST_PRIORITY_HIGH_ACCURACY
                        );
                    }
                },
                function (error) {}
            );
        },
        onRequestSuccess(success) {
            this.checkLocationStatus();
        },
        onRequestFailure(error) {
            alert("Turn on device location to use this app");
            navigator.app.exitApp();
        },
        onResume() {
            this.checkLocationStatus()
            this.locationsSort(this.createLocationObject())
            if (this.ref) {
                this.ref.hide()
            }
        },
        changeBackground(str) {
            this.backgroundColor = str
        },
        onDeviceReady() {
            this.deviceReady = true
        }
    },
    computed: {
        locationActive() {
            return (this.deviceReady && (this.lat || this.long)) ? true : false
            // return true;
        },
        backgroundColorStyle() {
            return this.backgroundColor ? `background-color: ${this.backgroundColor} !important` : ''
        }
    },
};
</script>

<style scoped>
</style>

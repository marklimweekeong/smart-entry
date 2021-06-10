<template>
<q-layout view="lHh Lpr lFf" class="main-page">
    <q-page-container>
        <q-page class="q-pa bg-image">
            <q-carousel ref="carousel" class="bg-image" v-model="slide" swipeable animated control-color="primary" height="93vh" navigation padding transition-prev="slide-right" transition-next="slide-left">
                <BaseSlide :name="slides[0].name" :title="slides[0].title" :description="slides[0].description">
                    <q-img alt="SmartEntry logo" src="~assets/logowithoutbg.png" style="height: 150px; width: 150px" />
                </BaseSlide>
                <SlideWithScreen :name="slides[1].name" :title="slides[1].title" :description="slides[1].description" :image="require(`../assets/Tutorial${slides[1].name}${scanImageIndex}.png`)" />
                <SlideWithScreen :name="slides[2].name" :title="slides[2].title" :description="slides[2].description" :image="require(`../assets/Tutorial${slides[2].name}${checkoutImageIndex}.png`)" />
                <SlideWithScreen :name="slides[3].name" :title="slides[3].title" :description="slides[3].description" :image="require(`../assets/Tutorial${slides[3].name}${checkinImageIndex}.png`)" />
                <BaseSlide v-if="$store.getters.newUser" :name="slides[4].name" :title="slides[4].title" :description="slides[4].description" :subtitle="slides[4].subtitle">
                    <template #mid>
                        <img alt="SmartEntry logo" :src="require('../assets/phoneid.png')" style="width: 70%; height:auto; margin-top:0px; margin-bottom:40px">
                    </template>
                </BaseSlide>
            </q-carousel>
            <div style="width: 90%; margin: auto; position: relative; top: -13px">
                <q-btn class="full-width" unelevated color="primary-dark" style="font-size: 16px" label="Next" @click="nextPage()" />
            </div>
        </q-page>
    </q-page-container>
</q-layout>
</template>

<script>
import SlideWithScreen from "../components/tutorial/SlideWithScreen.vue";
import BaseSlide from "../components/tutorial/BaseSlide.vue";
import {mapActions} from 'vuex';
export default {
    components: {
        SlideWithScreen,
        BaseSlide
    },
    data() {
        return {
            slide: "Main",
            scanImageIndex: 1,
            scanSeen: false,
            checkoutImageIndex: 1,
            checkoutSeen: false,
            checkinImageIndex: 1,
            checkinSeen: false,
            slides: [{
                    name: "Main",
                    title: "Welcome to SmartEntry",
                    description: "We'll handle SafeEntry for you, so you have more time for everything else",
                },
                {
                    name: "Scan",
                    title: "Scan SafeEntry QR Code to check-in",
                    description: "You will be automatically checked in upon scanning the QR Code",
                },
                {
                    name: "Checkout",
                    title: "Check-out without scanning",
                    description: "Be responsible and remember to check-out!",
                },
                {
                    name: "Checkin",
                    title: "Past venues are saved for easy check-in",
                    description: "Saved venues are sorted by proximity",
                },
                {
                    name: "Last",
                    title: "One more thing",
                    subtitle: "SmartEntry needs your IC and phone number to enable automatic check-in",
                    description: "Don't worry, your particulars are stored only on your device and will only be used for SafeEntry check-in. Click next to proceed with this step.",
                },
            ],
        };
    },
    methods: {
        ...mapActions(['disableNewUser']),
        scanImagesRotate() {
            setTimeout(() => {
                if (this.scanImageIndex == 4) {
                    this.scanImageIndex = 1;
                } else {
                    this.scanImageIndex++;
                }
                this.scanImagesRotate();
            }, 1500);
        },
        checkoutImagesRotate() {
            setTimeout(() => {
                if (this.checkoutImageIndex == 3) {
                    this.checkoutImageIndex = 1;
                } else {
                    this.checkoutImageIndex++;
                }
                this.checkoutImagesRotate();
            }, 1500);
        },
        checkinImagesRotate() {
            setTimeout(() => {
                if (this.checkinImageIndex == 3) {
                    this.checkinImageIndex = 1;
                } else {
                    this.checkinImageIndex++;
                }
                this.checkinImagesRotate();
            }, 1500);
        },
        nextPage() {
            if (this.slide == "Last" || (!this.$store.getters.newUser && this.slide == "Checkin")) {
                this.disableNewUser()
                this.$router.push("/");
            } else {
                this.$refs.carousel.next();
            }
        },
    },
    watch: {
        slide(value) {
            if (value == "Scan" && this.scanSeen == false) {
                this.scanSeen = true;
                this.scanImagesRotate();
            } else if (value == "Checkout" && this.checkoutSeen == false) {
                this.checkoutSeen = true;
                this.checkoutImagesRotate();
            } else if (value == "Checkin" && this.checkinSeen == false) {
                this.checkinSeen = true;
                this.checkinImagesRotate();
            }
        },
    },
    beforeCreate() {
        StatusBar.styleDefault()
        StatusBar.backgroundColorByHexString('#FFEEF7F4');
    },
    beforeDestroy() {
        StatusBar.styleLightContent()
        StatusBar.backgroundColorByHexString('#FF282828');
    }
};
</script>

<style scoped>
.bg-image {
    background-image: url(~assets/TutorialBackground.jpg) !important;
    background-size: 600px !important;
    background-position: right 0px bottom 0px;
}

.main-page {
    overflow: hidden !important;
}
</style>

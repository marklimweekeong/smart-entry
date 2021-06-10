<template>
<transition appear enter-active-class="animated fadeIn">
    <q-layout view="lHh Lpr lFf" style="background-color: white;">
        <Header title="SmartEntry">
            <template #front>
                <q-avatar>
                    <img src="~assets/logowithoutbg.png">
                </q-avatar>
            </template>
        </Header>
        <q-page-container>
            <!-- <q-page class="q-pa block"> -->
            <q-pull-to-refresh @refresh="refresh">
                <!-- long: {{long}}, lat: {{lat}} -->
                <Checkout @check-out="checkOutExisting" @check-out-all="checkOutAll" @view-pass="viewPass" />
                <Checkin @check-in="checkInExisting" @open-alert="openAlertPart1" />
            </q-pull-to-refresh>
            <q-dialog v-model="optionsDialog">
                <OptionsDialog :locationOptions="locationOptions" @select-option="selectOption" @close-dialog="optionsDialog = false" />
            </q-dialog>
            <q-dialog v-model="externalPageDialog">
                <ExternalLinkDialog :externalUrl="externalUrl" @close-dialog="externalPageDialog = false" />
            </q-dialog>
            <!-- </q-page> -->
        </q-page-container>
        <Footer @check-out-all="checkOutAll" />
        <transition appear enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
            <q-footer v-if="showAlert" bordered class="bg-list" style="bottom:70px; z-index:800 !important">
                <div style="padding: 8px 20px; font-size: 15px;">
                    {{alertString}}
                </div>
            </q-footer>
        </transition>
        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <q-layout class="fixed-center" v-if="loading" view="lHh Lpr lFf" style="background-color: rgb(10,10,10,0); z-index: 99999999">
                <div class="loading-container fixed-center"> </div>
                <q-spinner-gears class="fixed-center" color="primary" size="4em" />
            </q-layout>
        </transition>
    </q-layout>
</transition>
</template>

<script>
import Header from "../components/ui/Header.vue";
import Checkin from "../components/Checkin.vue";
import Checkout from "../components/Checkout.vue";
import Footer from "../components/ui/Footer.vue"
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
    name: "PageIndex",
    components: {
        Header,
        Footer,
        Checkin,
        Checkout,
        OptionsDialog: () => import('../components/dialogs/OptionsDialog.vue'),
        ExternalLinkDialog: () => import('../components/dialogs/ExternalLinkDialog.vue'),
    },
    data() {
        return {
            alertString: '',
            alertCount: 0,
            safeEntryCount: 0,
            showAlert: false,
            externalPageDialog: false,
            externalUrl: '',
            optionsDialog: false,
            hasMultipleOptions: false,
            selectedOption: null,
            loading: false,
            currentIndex: null,
            ref: undefined,
            locationRef: undefined,
            checkoutAllCounter: null,
            locationOptions: null,
        };
    },
    props: {
        lat: Number,
        long: Number,
    },
    emits: ['check-gps'],
    methods: {
        //General methods
        ...mapActions([
            "QRCodeStringAction",
            "lastUrlAction",
            "locationCheckinAction",
            "locationCheckoutAction",
            "locationsNewAction",
            "locationsSort",
            "externalAlertStringAction"
        ]),
        refresh(done) {
            setTimeout(() => {
                this.$emit('check-gps')
                this.locationsSort(this.createLocationObject())
                done()
            }, 500)
        },
        createLocationObject() {
            return {
                lat: this.lat,
                long: this.long
            }
        },
        titleize(str) {
            let upper = true
            let newStr = ""
            for (let i = 0, l = str.length; i < l; i++) {
                if (str[i] == " ") {
                    upper = true
                    newStr += str[i]
                    continue
                }
                newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase()
                upper = false
            }
            return newStr
        },
        pageCheckerCode(el, fieldRef = '') {
            //example el: document.getElementsByTagName('input')[1], fieldRef: value or textContent
            return `if(${el}){${el}${fieldRef?'.':''}${fieldRef}} else {document.title}`
        },
        pageClickerCode(el) {
            //example el: document.getElementsByTagName('input')[1], fieldRef: value or textContent
            return `if(${el}){${el}.click()}`
        },
        //General Check-in methods
        residentCheck() {
            //Checking if user is a resident
            if (this.isResident) {
                this.checkinFormPageResident()
            } else {
                this.checkinFormPageNonResident()
            }
        },
        checkinFormPageResident() {
            //Filling in the form if necessary
            var that = this;
            that.ref.executeScript({
                code: that.fillFormCode
            });
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByTagName("input")[1]', 'value')
                    },
                    function (value) {
                        if (value && String(value) != "SafeEntry") {
                            that.checkinFormPageSubmit();
                        } else {
                            that.checkinFormPageResident();
                        }
                    }
                );
            }, 5);
        },
        checkinFormPageNonResident() {
            //Clicking the non-residents button
            var that = this
            that.ref.executeScript({
                code: that.pageClickerCode('document.getElementById("non-resident-btn")')
            });
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByTagName("mat-label")[0]', 'textContent')
                    },
                    function (value) {
                        if (value == 'Passport:') {
                            that.checkinFormPageResident();
                        } else {
                            that.checkinFormPageNonResident();
                        }
                    }
                );
            }, 5);
        },
        checkinFormPageSubmit() {
            //Submitting the form
            var that = this;
            that.ref.executeScript({
                code: that.pageClickerCode('document.getElementsByClassName("checkin-btn")[1]')
            });
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByClassName("screenshot-help-text")[0]', 'textContent')
                    },
                    function (value) {
                        if (value && String(value) != "SafeEntry") {
                            that.safeEntryCount++
                            that.optionsDialog = false
                            that.loading = false
                            that.ref.executeScript({
                                code: "location.href"
                            }, function (event) {
                                that.lastUrlAction(String(event))
                            });
                            that.ref.show()
                            setTimeout(() => {
                                that.locationCheckinAction(that.currentIndex)
                            }, 200)
                        } else {
                            that.checkinFormPageSubmit();
                        }
                    }
                );
            }, 25);
        },
        //Check for trace-together only location
        checkForTTOnly() {
            var that = this
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByClassName("header")[0]', 'innerText')
                    },
                    function (value) {
                        if (value == 'TraceTogether Required') {
                            alert('This is a TraceTogether-only venue, please use the TraceTogether app to check-in.')
                            navigator.app.exitApp();
                        } else {
                            that.checkinLandingPageQRCode()
                        }
                    });
            }, 5)
        },
        //Check-in methods for locations with multiple options
        checkForMultipleOptions() {
            var that = this;
            setTimeout(() => {
                that.ref.executeScript({
                        code: 'if(document.getElementsByClassName("mat-card").length) {arr = []; for (const el of document.getElementsByClassName("mat-card")) {arr.push(el.innerText)}; arr} else {document.title}'
                    },
                    function (value) {
                        if (value && value != 'SafeEntry') {
                            that.safeEntryCount++
                            that.hasMultipleOptions = true
                            that.locationOptions = value[0]
                            that.optionsDialog = true
                            that.loading = false
                        } else {
                            that.checkForTTOnly()
                        }
                    });
            }, 5)
        },
        selectOption(index) {
            this.loading = true
            this.safeEntryTimer(this.safeEntryCount, true)
            this.selectedOption = index
            this.ref.executeScript({
                code: `document.getElementsByClassName("mat-card")[${index}].click()`
            })
            this.optionsDialog = false
            setTimeout(() => {
                this.checkinLandingPageQRCode()
            }, 5)
        },
        checkinOptionsQuickEvent() {
            this.ref.removeEventListener("loadstop", this.checkinOptionsQuickEvent);
            this.ref.executeScript({
                code: 'let arr'
            });
            setTimeout(this.checkinOptionsQuickLandingPage, 5);
        },
        checkinOptionsQuickLandingPage() {
            var that = this;
            that.ref.executeScript({
                code: that.pageClickerCode(`document.getElementsByClassName("mat-card")[${that.selectedOption}]`)
            })
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByClassName("checkin-btn")[0]', 'textContent')
                    },
                    function (value) {
                        if (value && String(value) != "SafeEntry") {
                            that.selectedOption = null
                            that.checkinLandingPage()
                        } else {
                            that.checkinOptionsQuickLandingPage();
                        }
                    }
                );
            }, 5);
        },
        //Existing Check-in methods
        checkInExisting(location, index) {
            if (navigator.connection.type == 'none') {
                this.openAlertPart1('No internet, unable to check-in')
            } else {
                this.safeEntryTimer(this.safeEntryCount, true)
                this.currentIndex = index;
                this.loading = true;
                this.ref = cordova.InAppBrowser.open(
                    location.url,
                    "_blank",
                    "location=no,zoom=no,hidden=yes,hardwareback=no,hidenavigationbuttons=yes"
                );
                if (Number.isInteger(location.optionIndex)) {
                    this.selectedOption = location.optionIndex
                    this.ref.addEventListener("loadstop", this.checkinOptionsQuickEvent);
                } else {
                    this.ref.addEventListener("loadstop", this.checkinEvent);
                }
            }
        },
        checkinEvent(event) {
            this.ref.removeEventListener("loadstop", this.checkinEvent);
            setTimeout(this.checkinLandingPage, 5);
        },
        checkinLandingPage() {
            var that = this;
            that.ref.executeScript({
                code: that.pageClickerCode('document.getElementsByClassName("checkin-btn")[0]')
            });
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementById("resident-btn")', 'textContent')
                    },
                    function (value) {
                        if (value && String(value) != "SafeEntry") {
                            that.residentCheck();
                        } else {
                            that.checkinLandingPage();
                        }
                    }
                );
            }, 5);
        },
        //QR code methods
        QRCodeEvent(event) {
            this.ref.removeEventListener(
                "loadstop",
                this.QRCodeEvent
            );
            if (
                event.url.substring(0, 31) != "https://www.safeentry-qr.gov.sg"
            ) {
                this.loading = false;
                this.externalUrl = event.url
                this.externalPageDialog = true
                this.closeRef();
            } else {
                setTimeout(this.checkinLandingPageQRCode, 100);
            }
        },
        checkinLandingPageQRCode() {
            var that = this;
            that.ref.executeScript({
                code: 'document.getElementsByClassName("checkin-btn")[0].click()'
            });
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByClassName("building-name")[0]', 'textContent')
                    },
                    function (value) {
                        if (value && value != 'SafeEntry') {
                            value = String(value)
                            const url = that.QRCodeString
                            const regExp = /\(([^)]+)\)/; //For locations with multiple options
                            const regExpSub = /^[^\(]+/ //For locations with multiple options
                            let title = that.hasMultipleOptions ? regExp.exec(value)[1] + ' - ' + regExpSub.exec(value)[0].trim() : value
                            title = that.titleize(title)
                            const checkedinIndex = that.checkedinLocations.findIndex(el => el.name === title)
                            const alreadyExistingIndex = that.locations.findIndex(el => el.name === title)
                            that.QRCodeStringAction('')
                            if (!(checkedinIndex >= 0)) {
                                if (alreadyExistingIndex >= 0) {
                                    that.currentIndex = alreadyExistingIndex
                                } else {
                                    that.currentIndex = that.locations.length
                                    that.locationsNewAction({
                                        name: title,
                                        title: title,
                                        url: url,
                                        lastUrl: "",
                                        icon: "place",
                                        coordinates: that.createLocationObject(),
                                        favourite: 0,
                                        optionIndex: that.hasMultipleOptions ? that.selectedOption : null,
                                        checkedin: 0,
                                    })
                                }
                                that.hasMultipleOptions = false
                                that.selectedOption = null
                                that.residentCheck();
                            } else {
                                that.viewPass(that.checkedinLocations[checkedinIndex])
                            }
                            that.hasMultipleOptions = false
                            that.selectedOption = null
                        } else {
                            that.checkForMultipleOptions()
                        }
                    }
                );
            }, 5);
        },
        //Check-out methods
        checkOutAll() {
            this.checkoutAllCounter = this.checkedinLocations.length;
            this.checkOutExisting(this.checkedinLocations[0], 0);
        },
        checkOutExisting(location, index) {
            if (navigator.connection.type == 'none') {
                this.openAlertPart1('No internet, unable to check-out')
            } else {
                this.safeEntryCount++
                this.safeEntryTimer(this.safeEntryCount, false)
                if (this.checkoutAllCounter) {
                    this.checkoutAllCounter -= 1;
                }
                this.currentIndex = index;
                this.loading = true;
                this.ref = cordova.InAppBrowser.open(
                    location.lastUrl,
                    "_blank",
                    "location=no,zoom=no,hidden=yes,hardwareback=no,hidenavigationbuttons=yes"
                );
                this.ref.addEventListener("loadstop", this.checkoutEvent);
            }
        },
        checkoutEvent(event) {
            this.ref.removeEventListener("loadstop", this.checkoutEvent);
            setTimeout(this.checkoutLandingPage, 5);
        },
        checkoutLandingPage() {
            var that = this;
            that.ref.executeScript({
                code: that.pageClickerCode('document.getElementsByClassName("checkout-btn")[0]')
            });
            setTimeout(() => {
                that.ref.executeScript({
                        code: that.pageCheckerCode('document.getElementsByClassName("screenshot-help-text-out")[0]', 'textContent')
                    },
                    function (value) {
                        if (value && String(value) != "SafeEntry") {
                            that.onCheckoutSuccess()
                        } else {
                            setTimeout(() => {
                                that.ref.executeScript({
                                        code: that.pageCheckerCode('document.getElementById("resident-btn")', 'textContent')
                                    },
                                    function (value) {
                                        if (value && String(value) != "SafeEntry") {
                                            that.onCheckoutSuccess()
                                        } else {
                                            that.checkoutLandingPage();
                                        }
                                    })
                            }, 5)
                        }
                    }
                );
            }, 5);
        },
        onCheckoutSuccess() {
            this.safeEntryCount++
            this.locationCheckoutAction(this.currentIndex);
            if (this.checkoutAllCounter > 0) {
                this.checkOutExisting(this.checkedinLocations[0], 0);
            } else {
                this.$emit('check-gps')
                this.locationsSort(this.createLocationObject())
                this.loading = false;
                this.closeRef()
                this.openAlertPart1('Check-out successful')
            }
        },
        safeEntryTimer(count, checkin) {
            const time = checkin ? 7000 : 4000
            setTimeout(() => {
                if (count === this.safeEntryCount) {
                    if (!checkin && this.checkoutAllCounter > 0) {
                        this.checkOutExisting(this.checkedinLocations[0], 0);
                    } else {
                        this.closeRef()
                        this.loading = false
                        if (checkin) {
                            this.openAlertPart1(`Check-in unsuccessful`)
                        }
                    }
                }
            }, time)
        },
        openAlertPart1(str) {
            setTimeout(() => {
                this.alertCount++
                if (this.showAlert) {
                    setTimeout(() => {
                        this.showAlert = false
                        setTimeout(() => {
                            this.openAlertPart2(str, this.alertCount)
                        }, 250)
                    }, 500)
                } else {
                    this.openAlertPart2(str, this.alertCount)
                }
            }, 150)
        },
        openAlertPart2(str, count) {
            this.alertString = str
            this.showAlert = true
            this.closeAlertTimer(count)
        },
        closeAlertTimer(count) {
            setTimeout(() => {
                if (count === this.alertCount) {
                    this.showAlert = false
                    this.alertString = ''
                }
            }, 5000)
        },
        //General inAppBrowser Methods
        closeRef() {
            this.ref.close();
            this.ref = undefined;
        },
        viewPass(location) {
            this.ref = cordova.InAppBrowser.open(
                location.lastUrl,
                "_blank",
                "location=no,zoom=no,hidden=no,hardwareback=no,hidenavigationbuttons=yes"
            );
        },
    },
    computed: {
        ...mapGetters(["QRCodeString", "checkedinLocations", "locations", 'userId', 'userPhone', 'isResident', 'externalAlertString']),
        fillFormCode() {
            return (`if(document.getElementsByTagName("input")[1]){const inputs = document.getElementsByTagName("input");` +
                `inputs[0].value="${this.userId}"; inputs[1].value="${this.userPhone}"; inputs[0].dispatchEvent(new Event("input")); inputs[1].dispatchEvent(new Event("input"));}`)
        }
    },
    watch: {
        optionsDialog(bool) {
            if (bool) {
                this.loading = false
            }
        },
        externalPageDialog(bool) {
            if (!bool) {
                this.externalUrl = ''
            }
        },
    },
    mounted() {
        this.locationsSort(this.createLocationObject())
        if (this.QRCodeString) {
            if (navigator.connection.type == 'none') {
                this.openAlertPart1('No internet, unable to check-in')
            } else {
                this.loading = true
                this.ref = cordova.InAppBrowser.open(
                    this.QRCodeString,
                    "_blank",
                    "location=no,zoom=no,hidden=yes,hardwareback=no,hidenavigationbuttons=yes"
                );
                this.safeEntryTimer(this.safeEntryCount, true)
                this.ref.addEventListener("loadstop", this.QRCodeEvent);
            }
        } else if (this.externalAlertString) {
            this.openAlertPart1(this.externalAlertString)
            this.externalAlertStringAction('')
        }
    },
    beforeCreate() {
        if (this.$store.getters.newUser == true) {
            this.$router.push('/tutorial')
        } else if (!this.$store.getters.userPhone) {
            this.$router.push('/profile')
        }
    },
    beforeDestroy() {
        this.QRCodeStringAction('')
    }
};
</script>

<style scoped></style>

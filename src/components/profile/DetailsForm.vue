<template>
<span>
    <Paragraph title="Personal Information" :expansion="false">
        <div class="q-ml-xs q-mb-xs">Your personal information is only used for automatic SafeEntry check-in. Click <a href="" @click.prevent="seePolicy">here</a> to review our Privacy Policy.</div>
        <div class="q-pt-sm">
            <q-form @submit="submitForm" class="q-gutter-md" style="width:100%" ref="form" no-error-focus>
                <FormItem label="Are you a resident of Singapore?">
                    <q-select outlined dense v-model="type" :options="typeOptions" behavior="menu" />
                </FormItem>
                <FormItem v-if="isResidentCheck" label="NRIC/FIN Number">
                    <q-input outlined dense v-model="nricField" :type="nricHide ? 'password' : 'text'" :rules="nricRules" noErrorIcon ref="ic">
                        <template v-slot:append>
                            <q-icon v-if="isResidentCheck" :name="nricHide ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="nricHide = !nricHide" />
                        </template>
                    </q-input>
                </FormItem>
                <FormItem v-else label="Passport Number">
                    <q-input outlined dense v-model="passportField" :type="passportHide ? 'password' : 'text'" :rules="passportRules" noErrorIcon ref="pp">
                        <template v-slot:append>
                            <q-icon v-if="!isResidentCheck" :name="passportHide ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="passportHide = !passportHide" />
                        </template>
                    </q-input>
                </FormItem>
                <FormItem label="Mobile Number" style="margin-top: 0px">
                    <q-input outlined dense v-model="phoneField" :type="phoneHide ? 'password' : 'text'" :rules="phoneRules" noErrorIcon ref="number">
                        <template v-slot:append>
                            <q-icon :name="phoneHide ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="phoneHide = !phoneHide" />
                        </template>
                    </q-input>
                </FormItem>
            </q-form>
        </div>
    </Paragraph>
    <q-footer class="footer-class q-pa-xs">
        <q-toolbar>
            <q-btn class="absolute-center" rounded color="primary" label="Save Profile" padding="8px 25px 8px 35px" style="font-size: 15px" no-caps icon-right="done" :disable="disableSubmit" @click=submitForm />
        </q-toolbar>
    </q-footer>
</span>
</template>

<script>
import FormItem from './FormItem.vue'
import {
    mapActions
} from 'vuex'

export default {
    components: {
        FormItem
    },
    // emits: ['see-data-policy'],
    data() {
        return {
            type: 'Resident',
            typeOptions: ['Resident', 'Non-resident'],
            nricHide: true,
            nricField: '',
            passportHide: true,
            passportField: '',
            phoneHide: true,
            phoneField: '',
            phoneError: true,
            passportError: true,
            nricError: true,
        }
    },
    computed: {
        nricRules() {
            return [
                val => (this.validateNric(val)) || "Invalid NRIC/FIN",
            ];
        },
        passportRules() {
            return [
                val => (!!val) || "Please enter your passport number",
            ]
        },
        phoneRules() {
            return [
                val => (this.validateNumber(val)) || "Invalid phone number",
            ]
        },
        isResidentCheck() {
            if (this.type === 'Resident') {
                return 1
            }
            return 0
        },
        disableSubmit() {
            if (!this.phoneError && this.changesMade) {
                if ((this.isResidentCheck && !this.nricError) || (!this.isResidentCheck && !this.passportError)) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        },
        changesMade() {
            if (this.isResidentCheck == this.$store.getters.isResident && this.phoneField == this.$store.getters.userPhone) {
                if ((this.isResidentCheck && this.nricField == this.$store.getters.userId) || (!this.isResidentCheck && this.passportField == this.$store.getters.userId)) {
                    return false
                }
                return true
            }
            return true
        },
    },
    watch: {
        phoneField(value) {
            if (this.validateNumber(value)) {
                this.$refs.number.resetValidation()
                this.phoneError = false
            } else {
                this.phoneError = true
            }
        },
        nricField(value) {
            if (this.validateNric(value)) {
                this.$refs.ic.resetValidation()
                this.nricError = false
            } else {
                this.nricError = true
            }
        },
        passportField(value) {
            if (this.passportField) {
                this.$refs.pp.resetValidation()
                this.passportError = false
            } else {
                this.passportError = true
            }
        },
    },
    methods: {
        // async test() {
        //     await this.$store.getters.db.putUserInfo('', '', 1)
        //     navigator.app.exitApp();
        // },
        ...mapActions(['userInformationAction', 'externalAlertStringAction']),
        // seeDataPolicy() {
        //     this.$emit('see-data-policy')
        // },
        seePolicy() {
            this._ref = cordova.InAppBrowser.open("https://sites.google.com/view/smartentryprivacypolicy/home", "_system");
        },
        submitForm() {
            this.externalAlertStringAction('Personal information updated')
            if (this.isResidentCheck) {
                this.userInformationAction({
                    userId: this.nricField,
                    userPhone: this.phoneField,
                    isResident: 1
                })
            } else {
                this.userInformationAction({
                    userId: this.passportField,
                    userPhone: this.phoneField,
                    isResident: 0
                })
            }
            this.$router.push('/')
        },
        validateNumber(str) {
            if (!str || str.length <= 7 || (str[0] != '+' && isNaN(str[0])))
                return false
            str = str.substring(1)
            for (let i = 0; i < str.length; i++) {
                if (str[i] != ' ' && str[i] != '-' && isNaN(str[i])) {
                    return false
                }
            }
            return true
        },
        validateNric(str) {
            //From https://gist.github.com/eddiemoore/7131781
            if (!str || str.length != 9)
                return false;
            str = str.toUpperCase();
            var i,
                icArray = [];
            for (i = 0; i < 9; i++) {
                icArray[i] = str.charAt(i);
            }
            icArray[1] = +icArray[1] * 2;
            icArray[2] = +icArray[2] * 7;
            icArray[3] = +icArray[3] * 6;
            icArray[4] = +icArray[4] * 5;
            icArray[5] = +icArray[5] * 4;
            icArray[6] = +icArray[6] * 3;
            icArray[7] = +icArray[7] * 2;
            var weight = 0;
            for (i = 1; i < 8; i++) {
                weight += icArray[i];
            }
            var offset = (icArray[0] == "T" || icArray[0] == "G") ? 4 : 0;
            var temp = (offset + weight) % 11;
            var st = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
            var fg = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];
            var theAlpha;
            if (icArray[0] == "S" || icArray[0] == "T") {
                theAlpha = st[temp];
            } else if (icArray[0] == "F" || icArray[0] == "G") {
                theAlpha = fg[temp];
            }
            return (icArray[8] === theAlpha);
        }
    },
    beforeMount() {
        if (this.$store.getters.isResident) {
            // this.type = this.typeOptions[0]
            this.nricField = this.$store.getters.userId
            this.nricError = this.nricField ? false : true
        } else {
            this.type = this.typeOptions[1]
            this.passportField = this.$store.getters.userId
            this.passportError = this.passportField ? false : true
        }
        this.phoneField = this.$store.getters.userPhone
        this.phoneError = this.phoneField ? false : true
    },
}
</script>

<style>

</style>

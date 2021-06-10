<template>
<Paragraph title="Privacy Policy" :expansion="true" @close-others="closeOthers" :triggerOpen="triggerOpen" :triggerClose="triggerClose">
    <q-separator />
    <div style="margin-top:10px; margin-bottom:10px;">
        Your personal information, location and SafeEntry history are stored only on
        this device and will not be transmitted, stored, shared or used externally for any
        purposes other than for SafeEntry check-in and check-out. Click <a href="https://sites.google.com/view/smartentryprivacypolicy/home" @click.prevent="seePolicy">here</a> to view our full Privacy Policy.
    </div>
</Paragraph>
</template>

<script>
export default {
    emits: ['close-others'],
    props: {
        triggerOpen: Number,
        triggerClose: Number,
    },
    methods: {
        closeOthers() {
            this.$emit('close-others')
        },
        seePolicy() {
            this._ref = cordova.InAppBrowser.open("https://sites.google.com/view/smartentryprivacypolicy/home", "_system");
        }
    }
}
</script>

<style></style>

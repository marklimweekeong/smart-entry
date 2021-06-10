<template>
<q-card>
    <q-card-section style="font-size:22px !important;font-weight:500 !important; padding-top: 12px" class="title">
        Non SafeEntry Link
    </q-card-section>
    <q-card-section style="word-wrap: break-word !important; padding-top:0px">
        {{ externalUrl }}
    </q-card-section>
    <q-card-actions align="right" style="padding-top:0px;">
        <q-btn flat label="Cancel" color="primary" @click="closeDialog" />
        <q-btn flat label="Visit link" color="primary" @click="visitExternalLink" />
    </q-card-actions>
</q-card>
</template>

<script>
export default {
    emits: ['close-dialog'],
    props: {
        externalUrl: String,
    },
    methods: {
        visitExternalLink() {
            this._ref = cordova.InAppBrowser.open(this.externalUrl, "_system");
            this.$emit('close-dialog')
        },
        closeDialog() {
            this.$emit('close-dialog')
        }
    }

}
</script>

<style>

</style>

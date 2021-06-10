<template>
<Paragraph title="By checking in, you declare that:" :expansion="false">
    <ul style="margin-top: 0px; margin-bottom: 0px">
        <li>
            You have not had close contact with a confirmed COVID-19 case in the past 14 days *#
        </li>
        <li>
            You are not currently under a Quarantine Order or Stay-Home Notice *
        </li>
        <li>
            You do not have any fever or flu-like symptoms *
        </li>
        <li>
            You agree to the <a href="https://www.safeentry-qr.gov.sg/termsofuse" @click.prevent="seeTerms" >terms</a> and consent to the collection/use of your information for COVID-19 contact tracing
        </li>
    </ul>
    <div style="margin-left: 10px; margin-top:8px">
    * not applicable if you are seeking treatment at a medical facility <br>
    # not applicable to COVID-19 frontline workers
    </div>
</Paragraph>
</template>

<script>
export default {
    methods: {
        seeTerms() {
            this._ref = cordova.InAppBrowser.open("https://www.safeentry-qr.gov.sg/termsofuse", "_system");
        }
    },
    onUnmounted() {
        this._ref.close()
    }
}
</script>

<style>

</style>

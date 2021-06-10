<template>
<!-- <Paragraph title="Frequently Asked Questions" :expansion="true" @close-others="closeOthers" :triggerOpen="triggerOpen" :triggerClose="triggerClose"> -->
<Paragraph title="Frequently Asked Questions" :expansion="true">
    <div v-for="(item, index) in qna" :key="index">
        <q-separator />
        <div style="margin-top:10px; margin-bottom:10px;">
            <div style="font-size: 14px; font-weight: 500">{{item.q}}</div>
            {{item.a}}
        </div>
    </div>
    <q-separator />
    <!--
    <div style="margin-top:10px; margin-bottom:10px;">
        <div style="font-size: 14px; font-weight: 500">Do you have any other questions or feedback for us?</div>
        Click <router-link to="/contact">here</router-link> to contact us.
    </div>
    <q-separator />
    -->
</Paragraph>
</template>

<script>
import Paragraph from '../ui/Paragraph.vue'
export default {
    // emits: ['close-others'],
    // props: {
    //     triggerOpen: Number,
    //     triggerClose: Number,
    // },
    data() {
        return {
            qna: [{
                    q: 'Can this app be used to check-in at TraceTogether-only venues?',
                    a: 'No, please use the TraceTogether app to check-in at these venues.',
                },
                {
                    q: 'Can this app still be used after TraceTogether-only check-in is rolled out islandwide?',
                    a: 'Unforunately, this app will no longer be usable at that point.',
                },
                {
                    q: 'Can I use this app without device location turned on?',
                    a: 'No, device location is necessary to use this app.'
                },
                {
                    q: 'Can I check-in on for multiple people at once?',
                    a: "Unfortunately not. While it would be relatively simple to add a feature to check-in multiple people at once, the number of people checked-in would not be reflected in the SafeEntry pass, and making changes to the pass retroactively to reflect multiple people being checked-in breaks SafeEntry's Terms of Use."
                },
                {
                    q: 'Can I view my check-in history?',
                    a: 'No, while planned, this functionality has yet to be added.'
                },
            ]
        }
    },
    // methods: {
    //     closeOthers() {
    //         this.$emit('close-others')
    //     }
    // }
}
</script>

<style>

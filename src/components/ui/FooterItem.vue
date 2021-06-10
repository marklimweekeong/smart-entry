<template>
<div class="col footer-link q-pb-xs q-pt-sm relative-position" v-ripple.center @click="clickEvent">
    <q-icon :name="iconName" class="footer-image" />
    <div class="footer-text">{{label}}</div>
</div>
</template>

<script>
export default {
    emits: ['click-event'],
    props: {
        iconName: String,
        label: String,
    },
    methods: {
        clickEvent() {
            this.$emit('click-event')
        }
    }
}
</script>

<style>

</style>

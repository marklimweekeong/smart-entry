<template>
<q-card style="width: 100%;" color="dark">
    <q-item>
        <q-item-label style="font-size:22px !important;font-weight:500 !important;" class="title">
            Where are you visiting?
        </q-item-label>
    </q-item>
    <q-item v-for="(option,index) in locationOptions" :key="index" style="padding:7px 30px">
        <q-btn class="full-width" unelevated color="primary" style="font-size: 16px" :label="option" @click="selectOption(index)">
        </q-btn>
    </q-item>
    <div style="height: 20px" />
    <q-btn flat color="header" round icon="close" style="font-size:1rem; position: absolute; top:7px; right: 7px" padding="none" @click="closeDialog" />
</q-card>
</template>

<script>
export default {
    emits: ['select-option', 'close-dialog'],
    props: {
        locationOptions: Array,
    },
    methods: {
        selectOption(index) {
            this.$emit('select-option', index)
        },
        closeDialog() {
            this.$emit('close-dialog')
        }
    }

}
</script>

<style>

</style>

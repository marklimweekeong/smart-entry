<template>
<div @dblclick="mainEvent">
    <q-item style="height:70px !important;">
        <q-item-section avatar>
            <q-icon :name="location.icon" color="primary" />
        </q-item-section>
        <q-item-section style="position: relative; left: -10px;">
            <q-item-label style="font-size: 16px; font-weight: 400" color="list">{{ location.title }}</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-btn no-caps round style="font-size: 12px; position: relative; left: 10px;" unelevated color="gray" text-color="list" :icon="icon" @dblclick.stop @click.stop="buttonEvent">
                <slot></slot>
            </q-btn>
        </q-item-section>
    </q-item>
    <q-separator />
</div>
</template>

<script>
export default {
    props: {
        location: Object,
        icon: String,
        index: Number,
    },
    emits: ['main-event', 'button-event'],
    methods: {
        mainEvent() {
            this.$emit('main-event', this.location, this.index)
        },
        buttonEvent() {
            this.$emit('button-event', this.location, this.index)
        },
    }
}
</script>

<style>

</style>
